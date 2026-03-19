const {ethers, upgrades} = require("hardhat");
const {expect} = require("chai");

describe("Test Upgraddeable Voting System Contract", function(){
    let voter1;
    let voter2;
    let voter3;
    let owner;
    let V1;
    let proxy;

    this.beforeEach(async function(){
        [owner, voter1, voter2, voter3] = await ethers.getSigners();

        V1 = await ethers.getContractFactory("VotingV1");
        proxy = await upgrades.deployProxy(V1, ["Black", "White"], 
            {initializer: "initialize", kind: "uups"});
        await proxy.waitForDeployment();

    });

    describe("State after deployment", function(){
        it("Should get correct options to vote for", async function(){
            const _option1 = await proxy.option1();
            const _option2 = await proxy.option2();

            expect(_option1.toString()).to.equal("Black");
            expect(_option2.toString()).to.equal("White");
        });
    });


    //add test for booleans as false

    //add tests for view options

    //add tests for vote and edge cases, like trying to vote twice or woner trying to vote

    //add tests for winner, test calling winner without entry
})