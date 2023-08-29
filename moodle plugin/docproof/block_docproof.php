<?php

/**
 * Plugin Name: Docproof
 * 
 * Description: This plugin allows to generate a hash from a selected file and look for it in the DocProof smart contract at Alastria's Red B.
 * 
 * Version: v0.2-alpha
 * 
 * Author: Pedro Cuevas
 * 
 * Moodle Version Required: 4.1 - Other versions not tested
 * 
 * @package    block_blockproof
 * @copyright  2023 Pedro Roque Cuevas Olarte
 * @license    MIT
 * 
 * Date: August 2023
 * 
 */


require_once($CFG->dirroot . '/lib/formslib.php');

// Form class for uploading the document
class block_docproof_form extends moodleform
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

class block_docproof extends block_base
{
    private $hash = '';

    public function init()
    {
        $this->title = get_string('pluginname', 'block_docproof');
    }

    public function get_content()
    {
        if ($this->content !== null) {
            return $this->content;
        }

        // Initialize the form for uploading the document
        $mform = new block_docproof_form();
        if ($mform->is_submitted()) {
            $file = $mform->get_file_content('userfile');
            if ($file !== false) { // Check if file content exists
                $this->hash = '0x';
                $this->hash .= hash('sha256', $file);
            }
        }

        $this->content = new stdClass;

        // Constructing the content
        $this->content->text .= "<p>Please select or upload a file to generate a hash, or type the hash yourself. Press 'Search Hash' to look for the hash in the DocProof smart contract at Alastria's Red B</p>";
        $this->content->text .= $mform->render();
        $this->content->text .= <<<HTML
            <div class="d-flex justify-content-center align-items-center" style="flex-direction: column;">
                <form id="hashForm" onsubmit="event.preventDefault(); docproof_callContract();">
                    <input type="text" id="userInputHash" placeholder="Enter hash here..." pattern="^0x[a-fA-F0-9]{64}$" required style="padding: 10px; border-radius: 4px; border: 1px solid #ccc; margin-bottom: 10px; margin-top: 10px;">
                    <button type="submit" style="padding: 10px 15px; background-color: #007BFF; color: white; border: none; border-radius: 4px; cursor: pointer;">Search hash</button>
                </form>
            </div>
        HTML;

        $this->content->text .= <<<HTML
            <div class="mt-5 d-flex align-items-center justify-content-center">
                <table id="docproof_contractDataTable" style="display: none; max-width: 45rem;" class="table table-bordered">
                    <thead class="thead-dark">
                        <tr>
                            <th colspan="2">Stored data retrieved from the blockchain</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>Date</td><td id="docproof_contractDate"></td></tr>
                        <tr><td>Size</td><td id="docproof_contractSize"></td></tr>
                        <tr><td>Owner Name</td><td id="docproof_contractOwnerName"></td></tr>
                        <tr><td>Title</td><td id="docproof_contractTitle"></td></tr>
                        <tr><td>Description</td><td id="docproof_contractDescription"></td></tr>
                        <tr><td>Valid</td><td id="docproof_contractValid"></td></tr>
                        <tr><td>Owner Address</td><td id="docproof_contractOwnerAddress"></td></tr>
                    </tbody>
                </table>
            </div>
            <div id="docproof_errorMessage" class="alert alert-danger mt-3" style="display: none;">Error retrieving data.</div>
        HTML;

        $abiPath = __DIR__ . '/assets/documentProofABI.json';
        $contractABI = json_encode(file_get_contents($abiPath));
        $ethersPath = (string) new moodle_url("/blocks/docproof/assets/ethers.min.js");

        $jsCode = <<<EOD
            <script type="module">
                import('$ethersPath').then(module => {
                    window.ethers = module.ethers;
                });

                document.getElementById("userInputHash").value = "{$this->hash}";

                window.docproof_callContract = function() {
                    document.getElementById("docproof_contractDataTable").style.display = "none";
                    document.getElementById("docproof_errorMessage").style.display = "none";
                    
                    const userInputHash = document.getElementById("userInputHash").value;

                    var provider = new window.ethers.JsonRpcProvider('http://185.180.8.164:8545');
                    var contractAddress = "0xb9a219631aed55ebc3d998f17c3840b7ec39c0cc";
                    var abi = $contractABI;

                    var contract = new window.ethers.Contract(contractAddress, abi, provider);
                    contract.getInstance(userInputHash)
                        .then(result => {
                            document.getElementById("docproof_contractDataTable").style.display = "table";
                            document.getElementById("docproof_contractDate").innerText = new Date(Number(result[0]) * 1000).toLocaleString();
                            document.getElementById("docproof_contractSize").innerText = Number(result[1]).toString();
                            document.getElementById("docproof_contractOwnerName").innerText = result[2];
                            document.getElementById("docproof_contractTitle").innerText = result[3];
                            document.getElementById("docproof_contractDescription").innerText = result[4];
                            document.getElementById("docproof_contractValid").innerText = result[5] ? "Yes" : "No";
                            document.getElementById("docproof_contractOwnerAddress").innerText = result[6];
                        })
                        .catch(error => {
                            let errorMessage = "Error retrieving data.";
                        
                            if (error.message.includes("reason=\"Hash is not mapped\"")) {
                                errorMessage = "The provided hash is not mapped in the smart contract.";
                            } else if (error.message.includes("reverted")) {
                                errorMessage = "The smart contract method reverted.";
                            } else if (error.message.includes("network")) {
                                errorMessage = "Network error. Please check your connection.";
                            }
                        
                            document.getElementById("docproof_errorMessage").innerText = errorMessage;
                            document.getElementById("docproof_errorMessage").style.display = "block";
                            console.error("Error calling the contract method:", error);
                        });                        
                }
            </script>
EOD;

        $this->content->footer .= $jsCode;

        return $this->content;
    }
}
