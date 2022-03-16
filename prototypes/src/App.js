import './App.css';

function App() {
  return (
    <div className="App">
      <div class="headings">
        <h1 style={{margin: "20px auto 0px auto"}}>PROTOTYPES,</h1>
        <h6 style={{margin: "0px 0 30px 300px"}}>I made when doing the Bruno - Three JS course</h6>
      </div>
      <div class="buttons">
        <button>CHAPTER 1: Basics</button>
        <button class="button disabled">CHAPTER 2: Classic Techniques</button>
        <button class="button disabled">CHAPTER 3: Advanced Techniques</button>
        <button class="button disabled">CHAPTER 4: Shaders</button>
        <button class="button disabled">CHAPTER 5: Extra</button>
      </div>
    </div>
  );
}

export default App;
