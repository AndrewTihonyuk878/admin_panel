// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

import { useHttp } from "../../hooks/http.hook"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { v4 as uuidv4 } from 'uuid'
import store from '../../store'

import { heroCreated } from "../heroesList/heroesSlice";
import { selectAll } from "../heroesFilters/filtersSlice"

const HeroesAddForm = () => {

    const [heroName, setHeroName] = useState('')
    const [heroDescr, setHeroDescr] = useState('')
    const [heroElement, setHeroElement] = useState('')

    const {filterLoadingStatus} = useSelector(state => state.filters)
    const filters = selectAll(store.getState())
    const dispatch = useDispatch()
    const {request} = useHttp()

    const onSubmitHandler = (e) => {
        e.preventDefault()

        const newHero = {
            id: uuidv4(),
            name: heroName,
            description: heroDescr,
            element: heroElement
        }

        request("http://localhost:3001/heroes", "POST", JSON.stringify(newHero))
        .then(res => console.log(res, 'Sending is successful'))
        .then(dispatch(heroCreated(newHero)))
        .catch(err => console.log('Something went wrong :('))

        setHeroName('')
        setHeroDescr('')
        setHeroElement('')
    }

    const renderFilters = (filters, status) => {
        if (status === "loading") {
            return <option>Loading elements</option>
        } else if (status === "error") {
            return <option>Loading error</option>
        }
        
        //якщо фільтри є, то рендеримо їх
        if (filters && filters.length > 0) {
            return filters.map(({name, label}) => {
                if (name === 'all') return

                return <option key={name} value={name}>{label}</option>
            })
        }
    }

    return (
        <form className="border p-4 shadow-lg rounded" onSubmit={onSubmitHandler}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Name of the new hero</label>
                <input 
                    required
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name" 
                    placeholder="What's my name?"
                    value={heroName}
                    onChange={(e) => setHeroName(e.target.value)}/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Description</label>
                <textarea
                    required
                    name="text" 
                    className="form-control" 
                    id="text" 
                    placeholder="What can I do?"
                    style={{"height": '130px'}}
                    value={heroDescr}
                    onChange={(e) => setHeroDescr(e.target.value)}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Choose a hero element</label>
                <select 
                    required
                    className="form-select" 
                    id="element" 
                    name="element"
                    value={heroElement}
                    onChange={(e) => setHeroElement(e.target.value)}>
                    <option >I own the element...</option>
{/*                     <option value="fire">Огонь</option>
                    <option value="water">Вода</option>
                    <option value="wind">Ветер</option>
                    <option value="earth">Земля</option> */}
                    {renderFilters(filters, filterLoadingStatus)}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Create</button>
        </form>
    )
}

export default HeroesAddForm;