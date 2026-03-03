import { StrictMode } from 'react';
import { useState, createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import './Ingredients.css';
import App from './App.jsx';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Offcanvas from 'react-bootstrap/Offcanvas'
import Button from 'react-bootstrap/Button'


function RecipeForm() {
    return (
        <form>
            <label>Search for an ingredient, recipe, etc.
                <input type="text" />
            </label>
        </form>
        );
    }

function AddIngredientForm() {
    const [currIngredient, setCurrIng] = useState('');
    function handleChange(e) {
        setCurrIng(e.target.value);
    }
    const [ingredients, setIngs] = useState('');

    function handleSubmit(e) {
        setIngs([...ingredients, currIngredient]);
        e.preventDefault();
        createRoot(document.getElementById('testDiv')).render(
            <AddIngredient currIngredient={currIngredient}/>
         );
     }
    return (
        <form onSubmit={handleSubmit}>
            <label>Enter Ingredient:
                <input type="text"
                value={currIngredient}
                onChange={handleChange}
                />
            </label>
            <input type='submit' className="btn-add-item"/>
            <p> Added: {currIngredient}</p>
            <p> test: {ingredients} </p>
        </form>
        );
    }

/*function IngredientList({ingredients}) {
    return (
        <p> {ingredients.map(ing => (
            <p key={ingredient}> {ingredient} </p>
            ))}
        </p>
        );
    }
*/
function IngOffCan() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
        <Button type="button" className="btn btn-success btn-add-item" onClick={handleShow}>Add Ingredient</Button>
        <Offcanvas className="pantry" show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title><h3>Add Ingredient </h3></Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                  <p>
                    <AddIngredientForm />
                  </p>
                </Offcanvas.Body>
              </Offcanvas>
        </>

        )

    }

const Pantry = ({ingredients}) => {
    return(
        <>
        <h3> Pantry </h3> 
        <IngOffCan />
        </>
    );
}

const Recipes = () => {
    return(
        <>
        <h3> Recipes </h3>
        <RecipeForm />
        </>
        )
    }

function NewRow() {
    return (
        <Container fluid>
            <Row id='currRow'>
            </Row>
        </Container>

        );
    }

function NewIngredient({currIngredient}) {
    return(
        <Col s={3}>
            <p>{currIngredient}</p>
        </Col>
        );
    }
function NewIngConfirm({currIngredient}) {
    return(
        <p> {currIngredient} added</p>
        );
    }

//let count = 0;

function AddIngredient({currIngredient}, {ingredients}) {
    /*if (count % 3 == 0) {
        createRoot(document.getElementById("ingBody")).render(
            <NewRow />
            );
      createElement(document.getElementById('currRow')).render(
          <NewIng />
          );
    }
    createElement(document.getElementById('currRow')).render(
        <NewIng />
    );
    createElement(document.getElementById('ingBody')).render(
        <NewIngConfirm />
        );
    count++;
    */
    return (
        <NewIngredient currIngredient={currIngredient}/>
        );
  }

function clearIng() {
    document.getElementById("ingBody").textContent = '';
  }

createRoot(document.getElementById('root')).render(
    <h1>We Have Food at Home</h1>
);
createRoot(document.getElementById('pantryDiv')).render(
    <Pantry />
);
createRoot(document.getElementById('recipeDiv')).render(
    <Recipes />
);
