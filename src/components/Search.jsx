import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Search = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [sortBy, setSortBy] = useState('s_no'); 
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    handleSearch();
  }, [page, sortBy, searchQuery]);

  const searchButtonClicked = () => {
    setSearchQuery(searchInput);
    setPage(1);
  };

  const handleSort = async () => {
    try {
      let newSortBy;
      if (sortBy === 'date' || sortBy === 'time') {
        newSortBy = 's_no';
      } else {
        newSortBy = 'date';
      }
      setSortBy(newSortBy);
      setPage(1);
    } catch (error) {
      console.error('Error sorting:', error);
    }
  };
  

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setSearchInput(inputValue);
    setSearchQuery(inputValue); 
    setPage(1);
  };

  const handleSortByDate = () => {
    setSortBy('date');
    setPage(1);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/data?page=${page}&search=${searchQuery}&sortBy=${sortBy}`);
      const data = response.data;
      setSearchResults(data);
      const filteredData = data.filter((customer) =>
        customer.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredData);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  return (
    <>
      <input
        type="text"
        placeholder="Search by name or location"
        value={searchInput}
        onChange={handleInputChange}
      />
      <button onClick={searchButtonClicked}>Search</button>
      <button onClick={handleSortByDate}>Sort By Date</button> 
      <button onClick={handleSort}>Reset Sorting</button> 
      <h1>Customers List</h1>

      <table border={1} cellPadding={10} cellSpacing={1} style={{textAlign:"center"}}>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Location</th>
            <th colSpan={2}>Created_at</th>
          </tr>
          <tr>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {searchResults.map((customer, index) => (
            <tr key={index}>
              <td>{customer.s_no}</td>
              <td>{customer.customer_name}</td>
              <td>{customer.age}</td>
              <td>{customer.phone}</td>
              <td>{customer.location}</td>
              <td>{new Date(customer.created_at).toLocaleDateString()}</td>
              <td>{new Date(customer.created_at).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous Page</button>
      <button onClick={() => setPage(page + 1)}>Next Page</button>
    </>
  );
};

export default Search;
