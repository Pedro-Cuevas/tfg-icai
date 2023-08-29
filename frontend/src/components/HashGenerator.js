import { MDBFile } from "mdb-react-ui-kit";

const HashGenerator = ({ setHashParent }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        const buffer = evt.target.result;
        const digest = await crypto.subtle.digest("SHA-256", buffer);
        const hashArray = Array.from(new Uint8Array(digest));
        const hashHex = hashArray
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
        setHashParent("0x" + hashHex);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="col-lg-4 col-md-10 col-sm-10 col-10">
      <MDBFile
        label="If you don't have a hash, you can upload a file here to generate a hash (we don't store any information)"
        id="customFile"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default HashGenerator;
