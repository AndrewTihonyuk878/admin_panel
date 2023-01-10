import {createSlice, createAsyncThunk, createEntityAdapter} from '@reduxjs/toolkit'
import { useHttp } from "../../hooks/http.hook";

const filtersAdapter = createEntityAdapter()

/* const initialState = {
    filters: [],
    filterLoadingStatus: 'idle',
    activeFilter: "all"
} */
const initialState = filtersAdapter.getInitialState({
    filterLoadingStatus: 'idle',
    activeFilter: "all"
})

export const fetchFilters = createAsyncThunk(
    'filters/fetchFilters',
    async () => {
        const {request} = useHttp()
        return await request("http://localhost:3001/filters") 
    }
)

const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
/*         filtersFetching: state => {
            state.filterLoadingStatus = 'loading'
        },
        filtersFetched: (state, action) => {
            state.filters = action.payload
            state.filterLoadingStatus = 'idle'
        },
        filtersFetchingError: state => {
            state.filterLoadingStatus = 'error'
        }, */
        activeFilterChanged: (state, action) => {
            state.activeFilter = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFilters.pending, state => {
                state.filterLoadingStatus = 'loading'
            })
            .addCase(fetchFilters.fulfilled, (state, action) => {
                state.filterLoadingStatus = 'idle'
                //state.filters = action.payload
                filtersAdapter.setAll(state, action.payload)
            })
            .addCase(fetchFilters.rejected, state => {
                state.filterLoadingStatus = 'error'
            })
            .addDefaultCase(() => {})
    }
})

const {actions, reducer} = filtersSlice

export default reducer

export const {selectAll} = filtersAdapter.getSelectors(state => state.filters)

export const {
    filtersFetching,
    filtersFetched,
    filtersFetchingError,
    activeFilterChanged
} = actions