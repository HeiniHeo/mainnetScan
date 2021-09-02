const fs = require('fs');
const merkle = require('merkle');
const CryptoJs = require('crypto-js');

/* 사용법 */
// const tree = merkle("sha256").sync([])
// tree.root()

class BlockHeader {
    constructor(version,index,previousHash, time, merkleRoot){
        this.version = version
        this.index = index //마지막 블럭의 index + 1
        this.previousHash = previousHash // 마지막 블럭의 index가 바뀌었기 때문에 얘도 바뀌어서 들어가야 함
        this.time = time
        this.merkleRoot = merkleRoot
    }
}

// const header = new BlockHeader(1,2,3,4,5)
// console.log(header)

class Block {
    constructor(header,body){
        this.header = header
        this.body = body
    }
}

// const blockchain = new Block(new BlockHeader(1,2,3,4,5),['hello'])
// console.log(blockchain)

function createGenesisBlock(){
    const version = getVersion(); // 1.0.0
    const index = 0;
    const time = getCurrentTime();
    const previousHash = '0'.repeat(64);
    const body = ['hello block'];

    const tree = merkle('sha256').sync(body);
    const root = tree.root() || '0'.repeat(64)

    const header = new BlockHeader(version,index,previousHash,time,root);
    return new Block(header,body)
}

let Blocks = [createGenesisBlock()];

function getLastBlock(){
    return Blocks[Blocks.length-1]
}

function getLastBlockIndex(){
    return Blocks[Blocks.length-1].header.index
}

function getVersion(){
    const package = JSON.parse(fs.readFileSync("../package.json").toString());
    return package.version
}

function getCurrentTime(){
    return Math.ceil(new Date().getTime()/1000)
}

// 다음 블럭의 header와 body를 만들어 주는 함수
function nextBlock(data){
    //header
    const prevBlock = getLastBlock()
    const version = getVersion()
    const index = getLastBlockIndex()+1
    const previousHash = createHash(prevBlock)
    const time = getCurrentTime()

    const merkleTree = merkle('sha256').sync(data)
    const merkleRoot = merkleTree.root() || `${getLastBlockIndex()+1}`.repeat(64)

    const header = new BlockHeader(version,index,previousHash,time,merkleRoot)
    return new Block(header,data)
}

function createHash(block){
    const{
        version,
        index,
        previousHash,
        time,
        merkleRoot
    } = block.header
    const blockString = version+index+previousHash+time+merkleRoot
    const Hash = CryptoJs.SHA256(blockString).toString()
    return Hash
}

// Blocks배열에 푸쉬
/*
function addBlock(){
    const version = getVersion();
    const index =  getLastBlockIndex()+1;
    const time = getCurrentTime();
    const previousHash = `${getLastBlockIndex()+1}`.repeat(64);
    const body = ['hello block'];

    const tree = merkle('sha256').sync(body);
    const root = tree.root() || `${getLastBlockIndex()+1}`.repeat(64);

    const header = new BlockHeader(version,index,previousHash,time,root);
    Blocks.push(new Block(header,body));
}
*/

function addBlock(data){
    const newBlock = nextBlock(data)
    if(isVaildNewBlock(newBlock,getLastBlock())){
        const newBlock = nextBlock(data);
        Blocks.push(newBlock);
        return true
    }
    return false
}

/* 
    1. 타입검사
*/
function isVaildNewBlock(currentBlock,previousBlock){
    isVaildType(currentBlock)
    return true
}

function isVaildType(block){
    console.log(block)
}

addBlock(["hello1"])
addBlock(["hello2"])
addBlock(["hello3"])

// console.log(Blocks)