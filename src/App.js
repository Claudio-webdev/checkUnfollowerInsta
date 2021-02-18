import React, { useReducer, useRef, useState, useEffect} from 'react'
import homepage from './assets/homepage.jpg';
import followerList from './assets/followerlist.jpg';
import mobilehomepage from './assets/mobilehomepage.jpg';
import mobileprofile from './assets/mobileprofile.jpg';
import mobilefollowerlist from './assets/mobilefollowerlist.jpg';
import './App.css';

const initialState = {
  olderfollowersList: [],
  newerfollowersList: [],
  desktopImages: [homepage, followerList],
  mobileImages: [mobilehomepage, mobileprofile, mobilefollowerlist],
  accountToDelete: [],
  language: 'Italiano'
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'GET_INGLISH_LISTS':
      let olderfollowersList = action.oldfollowers.split(/(\S+')/)
      let newerfollowersList = action.newfollower.split(/(\S+')/)
      let followersBefore = []
      let followersAfter = []
      olderfollowersList.forEach((el, i) => {
        if (i%2 === 0 ){
          return null
        }else {
          let oldfollowers = el.substring(0, el.length-1)
          followersBefore.push(oldfollowers)
        }
      })
      newerfollowersList.forEach((el, i) => {
        if (i%2 === 0 ){
          return null
        }else {
          let newfollowers = el.substring(0, el.length-1)
          followersAfter.push(newfollowers)
        }
      })
      return {
        ...state,
        olderfollowersList: followersBefore,
        newerfollowersList: followersAfter
      }
    case 'GET_UNFOLLOWERS':
      return {
        ...state,
        accountToDelete: action.payload,
      }
    case 'CHANGE_LANGUAGE':
      return {
        ...state,
        language: action.payload
      }
    case 'GET_ITALIAN_LIST':
      // let vecchiFollowersLista = action.oldfollowers.split(/(?<=\b\sdi\s)(\S+)/)
      // let nuoviFollowersLista = action.newfollower.split(/(?<=\b\sdi\s)(\S+)/)
      let vecchiFollowersLista = action.oldfollowers.split(/(di\s\S+)/)
      let nuoviFollowersLista = action.newfollower.split(/(di\s\S+)/)
      let seguaciPrima = [];
      let seguaciDopo = [];
      vecchiFollowersLista.forEach((el, i) => {
        if (i%2 === 0 ){
          return null
        }else {
          let vecchiFollowers = el.substring(0, el.length)
          seguaciPrima.push(vecchiFollowers)
        }
      })
      nuoviFollowersLista.forEach((el, i) => {
        if (i%2 === 0 ){
          return null
        }else {
          let nuoviFollowers = el.substring(0, el.length)
          seguaciDopo.push(nuoviFollowers)
        }
      })
      let a = []
      let b = []
      seguaciPrima.forEach((el) => {
        let x = el.slice(3);
        a.push(x)
      })
      seguaciDopo.forEach((el) => {
        let x = el.slice(3);
        b.push(x)
      })
      console.log(a.length)
      console.log(a)
      console.log(b.length)
      console.log(b)
      return {
        ...state,
        olderfollowersList: a,
        newerfollowersList: b,
      }

    default:
      return {
        ...state
      }
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  let languages = ['Italiano', 'English']
  console.log(state)
  const handleSubmit = (e) => {
    e.preventDefault()
    if (state.language === 'English') {
      dispatch({ type: 'GET_INGLISH_LISTS', oldfollowers:e.target.olderfollowersList.value , newfollower:e.target.newerfollowersList.value})
    }else {
      dispatch({ type: 'GET_ITALIAN_LIST', oldfollowers:e.target.olderfollowersList.value , newfollower:e.target.newerfollowersList.value})
    }
    
    e.target.olderfollowersList.value = null
    e.target.newerfollowersList.value = null
  }
  const handleCheck = () => {
      let difference = state.olderfollowersList.filter(x => !state.newerfollowersList.includes(x));
      console.log(state.olderfollowersList)
      console.log(state.newerfollowersList)

      dispatch({ type: 'GET_UNFOLLOWERS', payload: difference})
      console.log(difference)
  }
  const [copySuccess, setCopySuccess] = useState('');
  const textAreaRef = useRef(null);

  function copyToClipboard(e) {
    textAreaRef.current.select();
    document.execCommand('copy');
    // This is just personal preference.
    // I prefer to not show the the whole text area selected.
    e.target.focus();
    setCopySuccess('Now you can paste it on your device to use later');
  };
  useEffect(() => {

  }, [state.accountToDelete])
  const handleChangeLanguage = (e, el) => {
    e.preventDefault()
    dispatch({ type: 'CHANGE_LANGUAGE', payload: el })
    const languagebuttons = Array.from(document.querySelectorAll('.languageBtn'))
    languagebuttons.forEach((btn) => {
      btn.classList.remove('active')
    })
    e.target.classList.add('active')
  }

  return (
    <div className="App">
      <header className="App-header">
      <h1>UNFOLLOWER CHECKER </h1>
      <p>INSTAGRAM VERSION</p>
      {languages.map((el, i ) => (
          i === 0 ? <button key={el} className="languageBtn active" type="button" onClick={(e) => handleChangeLanguage(e, el)}>{el}</button> :
        <button key={el} className="languageBtn" type="button" onClick={(e) => handleChangeLanguage(e, el)}>{el}</button>
      ))}

      <div className="stepsApp">
        <div className="areatoPaste">
          <h2>STEP 1</h2>
          <form>
          <label>First Time List Field</label><br/>
            <textarea
              ref={textAreaRef}
              placeholder="If you have already your list GO to STEP 2"
            />
          </form>
          <div>
            <button onClick={copyToClipboard}>Copy</button> 
            <p className="succesCopy">{copySuccess}</p>
          </div>
        </div>
        <form onSubmit={(e) => handleSubmit(e)} className="formtoSub">
        <h2>STEP 2</h2>
          <label>Old  Followers</label><br/>
          <input type="text" id="fname" name="olderfollowersList"/><br/>
          <label>New  Followers</label><br/>
          <input type="text" id="lname" name="newerfollowersList"/><br/><br/>
          <input type="submit" value="Submit"/>
        </form> 
        <div>
          <h2>STEP 3</h2>
          <button type="button" onClick={handleCheck}>check</button>
        </div>
      </div>
      <p>Unfollowers account</p>
      <div className="gridAccountToDelete">
        {
          state.accountToDelete.map((account) => (
                <a key={account} href={`https://www.instagram.com/${account}`} target="_blank" rel="noreferrer">{account}</a>
          ))
        }
      </div>

        <h3>MOBILE VERSION</h3>
        <ul>
          <li>Accedere a Instagram senza passare per l'app che abbiamo sul cell ma attraverso il nostro browser (<b>Safari</b>, <b>GoogleChrome</b>)(per fare ciò avrete bisogno di sapere la vostra <i>email/nome utente</i> e <i>password</i>.</li>
          <li>Per <i>Utenti Android</i> prima di procedere scaricare l'app <i>Google Keep</i> serve per incollare la lista di follwers.</li>
          <li>Una volta nella homepage (<q>vedi foto 1</q>) toccare l'icona del proprio profilo.</li>
          <li>Entrati sul proprio profilo toccare la scritta <b>Follower</b>(<q>vedi foto 2</q>) e apparirà una scheda con la tua lista dei follower seguita da un pulsante rimuovi.(<q>vedi foto 3</q>)</li>
          <li>Partendo dalla foto del primo follower con un po' di domestichezza selezioniamo tutti i follower fino al completo caricamento di tutti i followers.(più si hanno followers più questa azione richiederà tempo). </li>
          <li>Copiamo la lista e torniamo in questa pagina Web</li>
          <li>Incollare la lista nello <strong>step 1</strong> .</li>
          <li>Selezioniamo <b>Copy</b>.</li>
          <li>A questo punto possiamo incollare il risultato in un file di testo come (<i>note su Apple devices o Google Keep per Android</i>).</li>
          <li>Passiamo allo <strong>step 2</strong> solo quando vediamo che nelle ore/giorni seguenti abbiamo perso uno o più followers.</li>
          <li>Quindi rientrare sul profilo Instagram e copiare la lista di Followers proprio come avevamo fatto in precedenza (punti dal 1 al 3)</li>
          <li>Incollare la nuova lista sotto New Followers. </li>
          <li>Prendere la vecchia lista, slavata in precedenza e incollarla sotto Old Followers. </li>
          <li>Cliccare su <b>Submit</b>.</li>
          <li>Pronti per sapere chi vi ha abbandonato? <strong>step 3</strong> allora cliccate su <b>Check</b>.</li>
          <li>Boooooooom</li>
        </ul>
        <div className="tutorialImagesMobile">
        {state.mobileImages.map((el) => (
          <img src={el} alt={el} key={el}/>
        ))}
      </div>
      <h3>DESKTOP TUTORIAL</h3>
        <ul>
          <li>Andare sulla pagina web del vostro profilo Instagram (per fare ciò avrete bisogno di sapere la vostra <i>email/nome utente</i> e <i>password</i>.</li>
          <li>A questo punto cliccare su <b>Follower</b>(vedi foto 1) e apparirà una scheda con la tua lista dei follower seguita da un pulsante rimuovi.(vedi foto 2)</li>
          <li>Partendo dalla foto del primo follower (tenendo premuto il tasto sinistro del mouse) scendiamo fino al completo caricamento di tutti i followers. </li>
          <li>Copiamo la lista e torniamo in questa App</li>
          <li>Incollare la lista nello <strong>step 1</strong> (tasto destro mouse e selezioniamo incolla).</li>
          <li>Clicchiamo su <b>Copy</b>.</li>
          <li>A questo punto possiamo incollare il risultato in un file di testo come (<i>note, microsoft word, openOffice</i>).</li>
          <li>Passiamo allo <strong>step 2</strong> solo quando vediamo che nelle ore/giorni seguenti abbiamo perso uno o più followers.</li>
          <li>Ora rientrare sul nostro profilo Instagram e copiare la lista di Followers proprio come avevamo fatto in precedenza (punti dal 1 al 3)</li>
          <li>Incollare la nuova lista sotto New Followers. </li>
          <li>Prendere la vecchia lista, slavata in precedenza e incollarla sotto Old Followers. </li>
          <li>Cliccare su <b>Submit</b>.</li>
          <li>Pronti per sapere chi vi ha abbandonato? allora cliccate su <b>Check</b>.</li>
          <li>Boooooooom</li>
        </ul>
      <div className="tutorialImagesDesktop">
        {state.desktopImages.map((el) => (
          <img src={el} alt={el} key={el}/>
        ))}
      </div>
      </header>
      
    </div>
  );
}

export default App;