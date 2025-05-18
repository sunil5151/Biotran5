export const contractABI =[
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "sha256",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "ipfs",
        "type": "string"
      }
    ],
    "name": "FileRecordStored",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "number",
        "type": "uint256"
      }
    ],
    "name": "NumberAddedToList",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "number",
        "type": "uint256"
      }
    ],
    "name": "NumberStored",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "number",
        "type": "uint256"
      }
    ],
    "name": "NumberStored1",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "getAllList",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getFiles",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "sha256",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "ipfs",
            "type": "string"
          }
        ],
        "internalType": "struct SimpleStorage.FileRecord[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "getList",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getNumber",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getNumber1",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_number",
        "type": "uint256"
      }
    ],
    "name": "setList",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_number",
        "type": "uint256"
      }
    ],
    "name": "setNumber",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_number",
        "type": "uint256"
      }
    ],
    "name": "setNumber1",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_sha256",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_ipfs",
        "type": "string"
      }
    ],
    "name": "storeFile",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];