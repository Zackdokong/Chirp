import './App.css'
import Chirp from './components/chirp'
import Input from './components/input'

function App() {
  return (
    <>
      <div className="body">
        <Input />
        <Chirp />
      </div>
    </>
  );
}

export default App