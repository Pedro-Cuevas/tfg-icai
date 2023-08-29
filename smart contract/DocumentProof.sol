pragma solidity 0.8.1;

contract DocumentProof {
    
    struct Info{
        uint date; // timestamp of the block where the hash was stored for the first time
        uint size;
        string ownerName;
        string title;
        string description;
        bool isValid; // indicates if the owner still considers the document valid
        address ownerAddress; // address that uploaded the hash (the owner)
    }

    mapping(bytes32 => Info) private hashToInfo;
    mapping(address => bytes32[]) private addressToHashes;

    event InstanceCreated(bytes32 hash, address owner);
    event InstanceUpdated(bytes32 hash, address owner);


    modifier hashMapped(bytes32 _hash){
        require(isHashMapped(_hash), "Hash is not mapped");
        _;
    }

    modifier onlyOwner(bytes32 _hash){
        require(isOwner(_hash), "Not owner of the hash");
        _;
    }    

    //records new instance
    function newInstance(bytes32 _hash, uint _size, string memory _ownerName, string memory _title, string memory _description) public {
        require(!isHashMapped(_hash), "Hash is already mapped");

        hashToInfo[_hash] = Info(block.timestamp, _size, _ownerName, _title, _description, true, msg.sender);
        addressToHashes[msg.sender].push(_hash);

        emit InstanceCreated(_hash, msg.sender);
    }

    //returns instance details
    function getInstance(bytes32 _hash) public view hashMapped(_hash) returns (Info memory){
        return (hashToInfo[_hash]);
    }

    //returns hashes stored by an specific address
    function getHashes(address _address) public view returns (bytes32[] memory){
        if (addressToHashes[_address].length != 0){
            return addressToHashes[_address];
        } else {
            bytes32[] memory emptyArray = new bytes32[](0);
            return emptyArray;
        }
    }

    //if called by owner, allows to edit size
    function setSize(bytes32 _hash, uint _size) public onlyOwner(_hash) hashMapped(_hash){
        hashToInfo[_hash].size = _size;
        emit InstanceUpdated(_hash, msg.sender);
    }

    //if called by owner, allows to edit ownerName
    function setOwnerName(bytes32 _hash, string memory _ownerName) public onlyOwner(_hash) hashMapped(_hash){
        hashToInfo[_hash].ownerName = _ownerName;
        emit InstanceUpdated(_hash, msg.sender);
    }

    //if called by owner, allows to edit title
    function setTitle(bytes32 _hash, string memory _title) public onlyOwner(_hash) hashMapped(_hash){
        hashToInfo[_hash].title= _title;
        emit InstanceUpdated(_hash, msg.sender);
    }

    //if called by owner, allows to edit description
    function setDescription(bytes32 _hash, string memory _description) public onlyOwner(_hash) hashMapped(_hash){
        hashToInfo[_hash].description = _description;
        emit InstanceUpdated(_hash, msg.sender);
    }

    //if called by owner, allows to edit isValid
    function setIsValid(bytes32 _hash, bool _isValid) public onlyOwner(_hash) hashMapped(_hash){
        hashToInfo[_hash].isValid = _isValid;
        emit InstanceUpdated(_hash, msg.sender);
    }

    //returns true if a hash has already been mapped. False otherwise.
    function isHashMapped(bytes32 _hash) private view returns (bool){
        return (hashToInfo[_hash].date > 0);
    }

    //returns true if msg.sender is the owner of an instance, based on the hash. False otherwise.
    function isOwner(bytes32 _hash) private view returns (bool){
        return (hashToInfo[_hash].ownerAddress == msg.sender);
    }
}
