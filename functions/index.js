const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp(functions.config().firebase)
const db = admin.firestore()

exports.addData = functions.https.onRequest((req, res) => {
  // Make it work from the client
  res.set('Access-Control-Allow-Origin', req.get('Origin'))
  // Store the relevant variables
  const { password, site, date, count } = JSON.parse(req.body)

  db.collection('admin')
    .doc('config')
    .get()
    .then(doc => {
      if (password !== doc.data().password) {
        throw new Error('Invalid password')
      }

      const data = {
        Date: admin.firestore.Timestamp.fromDate(new Date(date)),
        Count: parseInt(count)
      }

      return db
        .doc(`Sites/${site}`)
        .update({ Entries: admin.firestore.FieldValue.arrayUnion(data) })
    })
    .then(doc => {
      return res.json({
        status: 'success',
        message: 'New entry created'
      })
    })
    .catch(error =>
      res.json({
        status: 'error',
        message: error.message
      })
    )
})
