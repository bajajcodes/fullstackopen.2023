export default function Filter({onFilterChange}){
    
    const style = {
        marginBottom: 10
      }
      
    function handleFilter(event){
        const filter = event.target.value;
        onFilterChange(filter);
    }
    
    return(
        <form onChange={handleFilter} style={style}>
            <label>
                filter
                <input name="filter" />
            </label>
        </form>
    )
}