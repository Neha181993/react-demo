import { useState, useEffect, useContext } from "react"
import finnHub from "../apis/finnHub"
import { WatchListContext } from "../context/watchListContext"


export const AutoComplete = () => {
  const [search, setSearch] = useState("")
  const [results, setResults] = useState([])
  const { addStock } = useContext(WatchListContext)

  const renderDropdown = () => {
    const dropDownClass = search ? "show" : null
    return (
      <ul style={{
        height: "500px",
        overflowY: "scroll",
        overflowX: "hidden",
        cursor: "pointer"
      }} className={`dropdown-menu ${dropDownClass}`}>
        {results.map((result) => {
          return (
            <li onClick={() => {
              addStock(result.symbol)
              setSearch("")
            }} key={result.symbol} className="dropdown-item">{result.description} ({result.symbol})</li>
          )
        })}
      </ul>
    )
  }

  useEffect(() => {
    let isMounted = true
    const fetchData = async () => {
      try {
        const response = await finnHub.get("/search", {
          params: {
            q: search
          }
        })

        if (isMounted) {
          setResults(response.data.result)
        }

      } catch (err) {

      }
    }
    if (search.length > 0) {
      fetchData()
    } else {
      setResults([])
    }
    return () => (isMounted = false)
  }, [search])

  return <div className="w-50 p-5 rounded mx-auto">
    <div className="form-floating dropdown">
      <input style={{ backgroundColor: "rgba(145, 158, 171, 0.04)" }} id="search" type="text" className="form-control" placeholder="Search" autoComplete="off" value={search} onChange={(e) => setSearch(e.target.value)}></input>
      <label htmlFor="search">Search</label>
      {renderDropdown()}
    </div>
  </div>
}

/*

IMP Words:-

map
indexof
usestate
useeffect 
usecontext
axios - getAPI
props.children
try catch
async await
isMounted
setResults - rendering on saerched components
Style :- dropdown show class/ Adjust scrolling/ Height / Cursor
dropdown shows - results from API



StockOverviewPage.jsx is being divided into two parts. - 

  - Stocklist.jsx
  - AutoComplete.jsx

  Upon autocompletion stock must get added to the StockList Components for this purpose we have added the addStock function to the WatchListContext.jsx.
  To delete stock from the StockList we have added the deleteStock function to the WatchListContext.jsx.
  

In the above example when you search for a stock, It calls API which will setResults which is then being used within renderDropdown to show the output results. 

Explanation
Dependencies Array [search]: The useEffect hook is triggered whenever the search state changes. This means:
When the component mounts (initial render), if search is not an empty string, it will fetch data.
Whenever search changes due to user input (handled by onChange={(e) => setSearch(e.target.value)} on the input element), the effect will run again.
Behavior Breakdown
On Initial Render:

If search is an empty string, setResults([]) will be called to ensure results is empty.
If search is not empty, fetchData will be called to fetch search results.
On search Change:

Each time the user types into the search input, search state updates, triggering the useEffect again.
If search has a non-zero length, fetchData is called to fetch the new results based on the updated search value.
If search becomes empty, setResults([]) will be called to clear the results.

*/