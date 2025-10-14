import { expect } from "chai";
import { ethers } from "hardhat";
import { AppreciationNFT } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("AppreciationNFT", function () {
  let appreciationNFT: AppreciationNFT;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const AppreciationNFTFactory = await ethers.getContractFactory("AppreciationNFT");
    appreciationNFT = await AppreciationNFTFactory.deploy();
    await appreciationNFT.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      expect(await appreciationNFT.name()).to.equal("Baselifestyle Appreciation");
      expect(await appreciationNFT.symbol()).to.equal("BAPP");
    });

    it("Should set the right owner", async function () {
      expect(await appreciationNFT.owner()).to.equal(owner.address);
    });
  });

  describe("Minting", function () {
    it("Should mint an appreciation NFT", async function () {
      const postId = "post123";
      const tokenURI = "ipfs://QmTestHash";

      await expect(
        appreciationNFT.connect(user1).mintAppreciation(
          user2.address,
          postId,
          tokenURI
        )
      )
        .to.emit(appreciationNFT, "AppreciationMinted")
        .withArgs(0, postId, user1.address, user2.address, tokenURI);

      expect(await appreciationNFT.ownerOf(0)).to.equal(user2.address);
      expect(await appreciationNFT.tokenURI(0)).to.equal(tokenURI);
    });

    it("Should increment token IDs correctly", async function () {
      await appreciationNFT.connect(user1).mintAppreciation(
        user2.address,
        "post1",
        "ipfs://hash1"
      );

      await appreciationNFT.connect(user1).mintAppreciation(
        user2.address,
        "post2",
        "ipfs://hash2"
      );

      expect(await appreciationNFT.totalSupply()).to.equal(2);
      expect(await appreciationNFT.ownerOf(0)).to.equal(user2.address);
      expect(await appreciationNFT.ownerOf(1)).to.equal(user2.address);
    });

    it("Should store appreciation data correctly", async function () {
      const postId = "post123";
      await appreciationNFT.connect(user1).mintAppreciation(
        user2.address,
        postId,
        "ipfs://hash"
      );

      const appreciation = await appreciationNFT.getAppreciation(0);
      expect(appreciation.postId).to.equal(postId);
      expect(appreciation.sender).to.equal(user1.address);
      expect(appreciation.recipient).to.equal(user2.address);
      expect(appreciation.timestamp).to.be.gt(0);
    });

    it("Should revert when minting to zero address", async function () {
      await expect(
        appreciationNFT.mintAppreciation(
          ethers.ZeroAddress,
          "post123",
          "ipfs://hash"
        )
      ).to.be.revertedWith("Cannot mint to zero address");
    });

    it("Should revert with empty post ID", async function () {
      await expect(
        appreciationNFT.mintAppreciation(
          user2.address,
          "",
          "ipfs://hash"
        )
      ).to.be.revertedWith("Post ID required");
    });

    it("Should revert with empty token URI", async function () {
      await expect(
        appreciationNFT.mintAppreciation(
          user2.address,
          "post123",
          ""
        )
      ).to.be.revertedWith("Token URI required");
    });
  });

  describe("View Functions", function () {
    it("Should return correct total supply", async function () {
      expect(await appreciationNFT.totalSupply()).to.equal(0);

      await appreciationNFT.connect(user1).mintAppreciation(
        user2.address,
        "post1",
        "ipfs://hash1"
      );

      expect(await appreciationNFT.totalSupply()).to.equal(1);
    });

    it("Should map token to post ID", async function () {
      const postId = "post456";
      await appreciationNFT.connect(user1).mintAppreciation(
        user2.address,
        postId,
        "ipfs://hash"
      );

      expect(await appreciationNFT.tokenToPost(0)).to.equal(postId);
    });
  });
});

