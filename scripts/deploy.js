const {ethers} = require ("hardhat");

async function main(){

    const SimpleVoting = await ethers.getContractFactory("SimpleVoting");
    const simpleVoting = await SimpleVoting.deploy();
    await simpleVoting.waitForDeployment();

    const contractAddress = await simpleVoting.getAddress();
    console.log("Contract deployed at: ", contractAddress);



}
main().catch(console.error);