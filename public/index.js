// const addDataUrl = 'http://localhost:5001/moth-map/us-central1/addData'
const addDataUrl = 'https://us-central1-moth-map.cloudfunctions.net/addData'

const config = {
  apiKey: 'AIzaSyCCyQTJ-bBo8s-TsSNFNHXGUIq7HaxBCn0',
  authDomain: 'moth-map.firebaseapp.com',
  databaseURL: 'https://moth-map.firebaseio.com',
  projectId: 'moth-map',
  storageBucket: 'moth-map.appspot.com',
  messagingSenderId: '795327380062'
}
firebase.initializeApp(config)

var db = firebase.firestore()

db.collection('Sites')
  .orderBy('State')
  .orderBy('Name')
  .get()
  .then(querySnapshot => {
    const select = document.querySelector('#select-site')
    let currentState = ''
    querySnapshot.forEach(doc => {
      let entry = doc.data()
      if (entry.State !== currentState) {
        currentState = entry.State
        createOption(select, '', currentState)
      }
      createOption(select, doc.id, ` - ${entry.Name}`)
    })
  })

function createOption(select, value, text) {
  var option = document.createElement('option')
  option.value = value
  option.innerText = text
  select.appendChild(option)
}

// Handle for submissions async
const entryForm = document.forms['entry-form']
const output = document.querySelector('#output')
const select = document.querySelector('#select-site')

select.addEventListener(
  'change',
  event => {
    if (select.value === '') {
      select.setCustomValidity('Please select a site.')
    } else {
      select.setCustomValidity('')
    }
  },
  false
)

entryForm.addEventListener(
  'submit',
  event => {
    event.preventDefault()

    const submitButton = document.querySelector('button[type=submit]')
    setButtonEnabled(submitButton, false, 'Sending ...')

    output.className = ''

    const data = {}
    for (var element of entryForm.elements) {
      if (element.name !== '') {
        data[element.name] = element.value
      }
    }

    fetch(addDataUrl, {
      method: 'POST',
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        output.classList.add(data.status)
        output.innerText = data.message
        setButtonEnabled(submitButton, true, 'Save')
      })
  },
  false
)

function setButtonEnabled(btn, enabled, label) {
  btn.disabled = !enabled
  if (label) {
    btn.innerText = label
  }
}
