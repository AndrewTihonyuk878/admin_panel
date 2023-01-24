// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import store from '../../store'

import { activeFilterChanged, fetchFilters, selectAll } from './filtersSlice'
import Spinner from "../spinner/Spinner";

const HeroesFilters = () => {

    const {filterLoadingStatus, activeFilter} = useSelector(state => state.filters)
    const filters = selectAll(store.getState())
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchFilters())
    }, [])

    if (filterLoadingStatus === 'loading') {
        return <Spinner/>
    } else if (filterLoadingStatus === 'error') {
        return <h5 className="text-center mt-5">Loading error</h5>
    }

    const renderFilters = (arr) => {
        if(arr.length === 0) {
            return <h5 className="text-center mt-5">No filters found</h5>
        }

        return arr.map(({name, className, label}) => {
            const btnClass = classNames('btn', className, {
                'active': name === activeFilter
            })

            return <button
                        key={name}
                        id={name}
                        className={btnClass}
                        onClick={() => dispatch(activeFilterChanged(name))}
                        >{label}</button>
        })
    }

    const elements = renderFilters(filters)

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Filter heroes by elements</p>
                <div className="btn-group">
                    {elements}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;