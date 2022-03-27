
getItemsMethods =  async (limit, page)=>{
    return axios({
      method: "get",
      url: `/api/v1/brand?limit=${limit}&page=${page}`,
    });
  }
  
  
  setLimit = ()=>{
    return 12;
  }
  
    
  setDisplayPage = ()=>{
    return 5;
  }
  
  
  initialPage = ()=>{return 1};
  
  renderTableHead = () =>{
    return `<tr>
    <th scope="col">ID</th>
    <th scope="col">Brand Name</th>
    <th scope="col">Brand Image</th>
    <th scope="col">Number of products</th>
    <th scope="col">Ranking Points</th>
    <th scope="col">Created At</th>
    <th scope="col">&nbsp;</th>
    </tr>
    `;
  }
  
  
  renderTableRow = (item)=>{
    return `<tr>
    <td class="align-middle">${item._id}</td>
    <td class="align-middle">${item.name}</td>
    <td class="align-middle">${item.images.length > 0 ? `<img src=${item.images[0].firebaseUrl} style="max-width:100px;max-height:100px; object-fit: contain;">` : 'Not avalable'}</td>
    <td class="align-middle">${item.productsHold}</td>
    <td class="align-middle">${item.rankingPoints}</td>
    <td class="align-middle">${item.createdAt}</td>
    <td class="align-middle">
    <div class="dropdown position-static">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
          Manage
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
          <li><button class="manage-btn dropdown-item btn"  data-id='${item._id}' data-op='remove'>Edit</button></li>
          <li class="dropdown-divider"></li>
          <li><button class="manage-btn dropdown-item text-danger btn" data-id='${item._id}' data-op="edit">Remove</button></li>
        </ul>
      </div>
  </td>
  </tr>
  `;
  }
  
  
  bindRowAction = ()=>{
    $('.manage-btn').click(function (e) { 
      e.preventDefault();
      const id = $(this).attr('data-id');
      const op = $(this).attr('data-op');
      // call func here
      $('#page-modal').modal('show'); 
    });
  }
  
  setTableName = ()=>{
    return "Products"
  }