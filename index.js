const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const db = admin.firestore();
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}.`);
});

app.get("/", (req, res) => {
  return res.status(200).send("FCB-PAY-API root...");
});

app.post('/api/create', (req, res) => {
  (async () => {
    try {
      await db.collection("accounts").doc(req.body.account).create({
        account: parseInt(req.body.account),
        balance: req.body.balance,
        user_id: req.body.user_id,
        wallet_balance: req.body.wallet_balance,
      });

      return res.status(200).send({status: "Success", msg: "Data Saved"});
    } catch (error) {
      console.log(error);
      res.status(500).send({status: "Failed", msg: error});
    }
  })();
});

// read specific account
// get
app.get("/api/get/:account", (req, res) => {
  (async () => {
    try {
      const reqDoc = db.collection("accounts").doc(req.params.account);
      const account = await reqDoc.get();
      const response = account.data();

      return res.status(200).send({status: "Success", data: response});
    } catch (error) {
      console.log(error);
      res.status(500).send({status: "Failed", msg: error});
    }
  })();
});

// read all user details
// get
app.get("/api/getAll", (req, res) => {
  (async () => {
    try {
      const query = db.collection("accounts");
      const response = [];

      await query.get().then((data) => {
        const docs = data.docs; // query results

        docs.map((doc) => {
          const selectedData = {
            account: doc.data().account,
            balance: doc.data().balance,
            user_id: doc.data().user_id,
            wallet_balance: doc.data().wallet_balance,
          };
          response.push(selectedData);
        });

        return response;
      });

      return res.status(200).send({status: "Success", data: response});
    } catch (error) {
      console.log(error);
      res.status(500).send({status: "Failed", msg: error});
    }
  })();
});

// update
// put
app.put("/api/update/:account", (req, res) => {
  (async () => {
    try {
      const reqDoc = db.collection("accounts").doc(req.params.account);
      await reqDoc.update({
        account: req.body.account,
        balance: req.body.balance,
        user_id: req.body.user_id,
        wallet_balance: req.body.wallet_balance,
      });

      return res.status(200).send({status: "Success", msg: "Data Updated"});
    } catch (error) {
      console.log(error);
      res.status(500).send({status: "Failed", msg: error});
    }
  })();
});

// delete
// delete
app.delete("/api/delete/:account", (req, res) => {
  (async () => {
    try {
      const reqDoc = db.collection("accounts").doc(req.params.account);
      await reqDoc.delete();
      return res.status(200).send({status: "Success", msg: "Data Removed"});
    } catch (error) {
      console.log(error);
      res.status(500).send({status: "Failed", msg: error});
    }
  })();
});
