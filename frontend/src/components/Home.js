import React from "react";

const Home = () => {
  return (
    <div className="container mt-5">
      <h1>Welcome!</h1>

      <section className="mt-4">
        <h2>How can I use this web?</h2>
        <h4>Interacting with DocumentProof.sol</h4>
        <p>
          DocumentProof.sol is a smart contract deployed at Alastria's Red B.
          You can interact with it to upload document verifications, retrieve
          them, or edit some of their data if you are the owner. If you want to
          upload or edit data in the blockchain, you will need a crypto wallet
          connected to the Red B to sign transcations (we recommend{" "}
          <a href="https://metamask.io/">Metamask</a>).
        </p>
        <p>
          To connect your Metamask account to the Red B:
          <ol>
            <li>Open Metamask</li>
            <li>Click on "Add Networks"</li>
            <li>Click on "Add Network manually"</li>
            <li>Fill the form with the following data:</li>
            <ul>
              <li>Network Name: [your preferred name]</li>
              <li>RPC URL: http://185.180.8.164:8545</li>
              <li>Chain ID: 2020</li>
              <li>Symbol: ETH</li>
            </ul>
          </ol>
        </p>
        <h4>Managing an account</h4>
        <p>
          You can also create an account, and use it to store information in our
          servers, so that it's easier for you to keep track of some of the
          documents stored in the blockchain.
        </p>
      </section>

      <section className="mt-4">
        <h2>What is blockchain?</h2>
        <p>
          A blockchain is a growing list of records, called blocks, that are
          linked together using cryptography. Each block contains a
          cryptographic hash of the previous block, a timestamp, and transaction
          data. Due to its design, a blockchain is resistant to modification of
          its data. This concept can be applied to many different use cases,
          such as securing financial transactions, supply chain and logistics
          monitoring, real-time IoT operating systems, and much more.
        </p>
        <div className="d-flex align-items-center justify-content-center mt-4 mb-4">
          <iframe
            style={{ maxWidth: "100%" }}
            width="560"
            height="315"
            src="https://www.youtube.com/embed/SSo_EIwHSd4"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      <section className="mt-4">
        <h2>What is Alastria's Red B?</h2>
        <p>
          Alastria's Red B, or Alastria's B Network, is one of the networks
          managed by the Alastria consortium, which focuses on the development
          and application of blockchain technologies in Spain. The B Network is
          a permissioned blockchain network, meaning it operates under a
          governance model which restricts who can participate in the network,
          and only in particular roles. It provides a stable environment and is
          commonly used for projects that require a certain level of trust and
          verification.
        </p>
      </section>
    </div>
  );
};

export default Home;
