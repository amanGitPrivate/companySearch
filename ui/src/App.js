import React, { useEffect, useState, Fragment } from "react";
import "./App.css";

function App() {

    const [compnayList, updateCompanyList] = useState([]);
    const [compnayListMaster, updateCompanyListMaster] = useState([]);
    const [fetchCompany, companyFetched] = useState(false);
    const [selectedFilters, updateFilter] = useState([]);

    useEffect(() => {
      if(!fetchCompany) {
        fetch('http://localhost:1111/') 
        .then((resp) => resp.json())
        .then(function(data) {
          updateCompanyList(data);
          companyFetched(true)
          updateCompanyListMaster(data);
        })
        .catch(function() {
        });
      }
    });
  
  const filterTable = () => {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }       
    } 
  };

  const selectSpeciality = ({ target :{checked, value}}) => {
    const selectedFiltersVar = JSON.parse(JSON.stringify(selectedFilters));
    let companyListVar = JSON.parse(JSON.stringify(compnayListMaster))
    if(checked) {
      selectedFiltersVar.push(value);
    } else {
      const index = selectedFiltersVar.indexOf(value);
      if (index > -1) {
        selectedFiltersVar.splice(index, 1);
      }
    }
    companyListVar = companyListVar.filter(company => 
      selectedFiltersVar.indexOf(company.specialty) !== -1
    );
    companyListVar = companyListVar.length ? companyListVar : compnayListMaster;
    updateFilter(selectedFiltersVar);
    updateCompanyList(companyListVar);
  }

  return (
    <div className="App">
      <input
        type="text"
        id="myInput"
        onKeyPress={filterTable}
        placeholder="Search for names.."
        title="Type in a name"
      ></input>
      <table id="myTable">
        <thead className="header">
          <tr>
            <th>CompanyName</th>
            <th>Image</th>
            <th>Specialty</th>
            <th>City</th>
          </tr>
        </thead>
        <tbody>
         {
           compnayList.map(({companyName, logo, specialty, city}) => 
              <tr>
              <td>{companyName}</td>
              <td><img className="company-logo" src={logo} alt="company-logo"/></td>
              <td>{specialty}</td>
              <td>{city}</td>
            </tr>)
         } 
        </tbody>
      </table>
      <div>
        {
          [...new Set(compnayListMaster.map(item => item.specialty))].map((specialty) => 
          <Fragment>
            <input type="checkbox" name={specialty} value={specialty} onChange={(event) => selectSpeciality(event)}/>
            <label htmlFor="vehicle1">{specialty}</label><br></br>
          </Fragment>
          )
        } 
      </div> 
    </div>
  );
}

export default App;
