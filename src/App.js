import React, { useReducer, useRef, useState, useEffect} from 'react'
import homepage from './assets/homepage.jpg';
import setting from './assets/settings.jpg';
import privacy from './assets/privacy.jpg';
import accountData from './assets/account-data.jpg';
import followerList from './assets/followerlist.jpg';
import './App.css';

const initialState = {
  olderfollowersList: [],
  newerfollowersList: [],
  desktopImages: [homepage, setting, privacy, accountData, followerList],
  accountToDelete: []
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'GET_LISTS':
      let olderfollowersList = action.oldfollowers.split(/[\s]+/)
      let newerfollowersList = action.newfollower.split(/[\s]+/)
      return {
        ...state,
        olderfollowersList: olderfollowersList,
        newerfollowersList: newerfollowersList
      }
    case 'GET_UNFOLLOWERS':
      return {
        ...state,
        accountToDelete: action.payload,
      }

    default:
      return {
        ...state
      }
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  console.log(state)
  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch({ type: 'GET_LISTS', oldfollowers:e.target.olderfollowersList.value , newfollower:e.target.newerfollowersList.value})
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

  return (
    <div className="App">
      <header className="App-header">
      <h1>UNFOLLOWER CHECKER </h1>
      <div className="stepsApp">
        <div className="areatoPaste">
          <h2>STEP 1</h2>
          <form>
          <label>First Time List Field</label><br/>
            <textarea
              ref={textAreaRef}
              placeholder="If you have already your list GO to PART 2"
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
      <div className="gridAccountToDelete">
        {
          state.accountToDelete.map((account) => (
                <h4>{account}</h4>
          ))
        }
      </div>
        <h3>DESKTOP TUTORIAL</h3>
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