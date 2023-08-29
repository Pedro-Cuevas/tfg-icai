<?php

/**
 * Plugin Name: Docupload
 * 
 * Description: This plugin allows to generate a hash from a selected file and upload it, along more optional details, to the blockchain.
 * 
 * Version: v0.1-alpha
 * 
 * Author: Pedro Cuevas
 * 
 * Moodle Version Required: 4.1 - Other versions not tested
 * 
 * @package    block_docuploader
 * @copyright  2023 Pedro Roque Cuevas Olarte
 * @license    MIT
 * 
 * Date: August 2023
 * 
 */

require_once($CFG->dirroot . '/lib/formslib.php');

// Form class for uploading the document
class block_docuploader_form extends moodleform
{
    protected function definition()
    {
        $mform = $this->_form;
        $mform->addElement('filepicker', 'userfile', '');
        $mform->_elements[0]->_attributes['style'] = "margin: 0 auto; display: block;";

        // Form class for uploading the document
        $mform->addElement('submit', 'submitbutton', 'Generate hash');
    }
}

class block_docuploader extends block_base
{
    private $hash = '';

    public function init()
    {
        $this->title = get_string('pluginname', 'block_docuploader');
    }

    public function get_content()
    {
        if ($this->content !== null) {
            return $this->content;
        }

        // Initialize the form for uploading the document
        $mformUpload = new block_docuploader_form();
        if ($mformUpload->is_submitted()) {
            $file = $mformUpload->get_file_content('userfile');
            if ($file !== false) { // Check if file content exists
                $this->hash = '0x';
                $this->hash .= hash('sha256', $file);
            }
        }

        $this->content = new stdClass;

        // Constructing the content
        $this->content->text .= "<p>Please select or upload a file to generate a hash, or type the hash yourself. Input the other parameters and press 'Upload' to upload it to the public. <b>All the data that you upload will be publicly accessible forever</b>, so input dummy text if you want to just update the hash</p>";
        $this->content->text .= $mformUpload->render();
        $this->content->text .= <<<HTML
            <div class="d-flex justify-content-center align-items-center" style="flex-direction: column;">
                <form id="hashForm" onsubmit="event.preventDefault(); docuploader_callContract();">
                    <input type="text" id="docuploader_Hash" placeholder="Enter hash here..." pattern="^0x[a-fA-F0-9]{64}$" required style="display: block; width: 100%; padding: 10px; border-radius: 4px; border: 1px solid #ccc; margin-bottom: 10px; margin-top: 10px;">
                    
                    <input type="text" id="docuploader_OwnerName" placeholder="Owner name" required style="display: block; width: 100%; padding: 10px; border-radius: 4px; border: 1px solid #ccc; margin-bottom: 10px;">
                    
                    <input type="text" id="docuploader_Title" placeholder="Title" required style="display: block; width: 100%; padding: 10px; border-radius: 4px; border: 1px solid #ccc; margin-bottom: 10px;">
                    
                    <textarea id="docuploader_Description" placeholder="Description" rows="3" required style="display: block; width: 100%; padding: 10px; border-radius: 4px; border: 1px solid #ccc; margin-bottom: 10px;"></textarea>
                    
                    <div class="d-flex justify-content-between" style="width: 100%;">
                        <input type="number" id="docuploader_Size" placeholder="Size" required style="flex-grow: 1; padding: 10px; border-radius: 4px; border: 1px solid #ccc; margin-right: 10px;">
                        <button type="submit" style="padding: 10px 15px; background-color: #007BFF; color: white; border: none; border-radius: 4px; cursor: pointer;">Upload</button>
                    </div>
                </form>
            </div>
            <div id="docuploader_errorMessage" class="alert alert-danger mt-3" style="display: none;">Error uploading data.</div>
            <div id="docuploader_successMessage" class="alert alert-success mt-3" style="display: none;">Information uploaded successfully!</div>
        HTML;

        $abiPath = __DIR__ . '/assets/documentProofABI.json';
        $contractABI = json_encode(file_get_contents($abiPath));
        $ethersPath = (string) new moodle_url("/blocks/docuploader/assets/ethers.min.js");

        $jsCode = <<<EOD
            <script type="module">
                import('$ethersPath').then(module => {
                    window.ethers = module.ethers;
                });

                document.getElementById("docuploader_Hash").value = "{$this->hash}";

                window.docuploader_callContract = async function() {
                    document.getElementById("docuploader_errorMessage").style.display = "none";
                    document.getElementById("docuploader_successMessage").style.display = "none";
                    
                    try {
                        const provider = new window.ethers.BrowserProvider(window.ethereum);
                        const signer = await provider.getSigner();
                        const contractAddress = "0xb9a219631aed55ebc3d998f17c3840b7ec39c0cc";
                        const contract = new window.ethers.Contract(contractAddress, {$contractABI}, signer);

                        const hash = document.getElementById("docuploader_Hash").value;
                        const ownerName = document.getElementById("docuploader_OwnerName").value;
                        const title = document.getElementById("docuploader_Title").value;
                        const description = document.getElementById("docuploader_Description").value;
                        const size = document.getElementById("docuploader_Size").value;

                        console.log({hash, size, ownerName, title, description});

                        const tx = await contract.newInstance(hash, size, ownerName, title, description);
                        console.log(tx);
                        if (tx.hash) {
                            document.getElementById("docuploader_successMessage").style.display = "block";
                        }
                    } catch (error) {
                        let errorMessage = "Error uploading data.";
                        
                        if (error.message.includes("reason=\"Hash is already mapped\"")) {
                            errorMessage = "The provided hash is already mapped in the smart contract.";
                        } else if (error.message.includes("reverted")) {
                            errorMessage = "The smart contract method reverted.";
                        } else if (error.message.includes("network")) {
                            errorMessage = "Network error. Please check your connection.";
                        }
                    
                        document.getElementById("docuploader_errorMessage").innerText = errorMessage;
                        document.getElementById("docuploader_errorMessage").style.display = "block";
                        console.error("Error calling the contract method:", error);
                    }                    
                }
            </script>
        EOD;


        $this->content->footer .= $jsCode;

        return $this->content;
    }
}
