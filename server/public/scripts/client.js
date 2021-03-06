console.log( 'js' );

$( document ).ready( function(){
  console.log( 'JQ' );
  // Establish Click Listeners
  setupClickListeners()
  // load existing koalas on page load
  getKoalas();

}); // end doc ready

function setupClickListeners() {
  $( '#addButton' ).on( 'click', function(){
    console.log( 'in addButton on click' );
    // get user input and put in an object
    let koalaToSend = {
      name: $('#nameIn').val(),
      age: $('#ageIn').val(),
      gender: $('#genderIn').val(),
      readyForTransfer: $('#readyForTransferIn').val(),
      notes: $('#notesIn').val(),
    };
    // call saveKoala with the new obejct
    saveKoala( koalaToSend );
    // clear inputs
    $('input').val('');
    $('select').val('');
  });
  // other click handlers:
  $('#viewKoalas').on('click', '.deleteKoalaButton', deleteKoala);
  $('#viewKoalas').on('click', '.transferButton', transferKoala);
}

function getKoalas(){
  console.log( 'in getKoalas' );
  // ajax call to server to get koalas
  $.ajax({
    method: 'GET',
    url: '/koalas'
  }).then(function(response){
    console.log('back from /koalas GET', response);
    //call function to display koalas
    displayKoalas(response);
  }).catch(function(err){
    console.log('error in GET /koalas', err);
    alert('Error getting koalas');
  });
} // end getKoalas

function saveKoala( newKoala ){
  console.log( 'in saveKoala', newKoala );
  // ajax call to server to get koalas (POST)
 $.ajax({
   method: 'POST',
   url: '/koalas',
   data: newKoala
 }).then(function(response){
   console.log('back from POST:', response);
   // run getKoalas to show the newest addition
   getKoalas();
 }).catch(function(err){
   console.log('error in POST /koalas', err);
   alert('Error collecting new Koala :(');
 });
}

function displayKoalas(response){
  let el = $('#viewKoalas');
  el.empty();
  //loop through response and display in table on DOM
  for (let i=0; i<response.length; i++){
    el.append(`<tr>
    <td>${response[i].name}</td>
    <td>${response[i].age}</td>
    <td>${response[i].gender}</td>
    <td>${response[i].ready_for_transfer}</td>
    <td>${response[i].notes}</td>
    <td id="transferBtnCell${i}"></td>
    <td><button class="deleteKoalaButton" data-id="${response[i].id}">Delete</button></td>
    </tr>`);
    // conditional to add 'ready to transfer' button
    if (response[i].ready_for_transfer === false){
      $(`#transferBtnCell${i}`).append(`<button class="transferButton" data-id="${response[i].id}">Ready for transfer</button>`)
    } else if (response[i].ready_for_transfer === true){
      $(`#transferBtnCell${i}`).append(`<button class="transferButton" data-id="${response[i].id}">Not ready</button>`)
    }
  }
}

function deleteKoala(){
  console.log('in deleteKoala, id:', $(this).data('id'));
  // TODO: ajax DELETE request
  $.ajax({
    method: 'DELETE',
    url: `/koalas?id=${$(this).data('id')}`
  }).then(function(response){
    console.log('back from DELETE:', response);
    //run getKoalas to show deletion on the DOM
    getKoalas();
  }).catch(function(err){
    console.log(err);
    alert('Error deleting koala');
  })
}

function transferKoala(){
  console.log('in transferKoala, id:', $(this).data('id'));
  // TODO: ajax UPDATE request
  $.ajax({
    method: 'PUT',
    url: `/koalas?id=${$(this).data('id')}`
  }).then(function(response){
    console.log('back from PUT:', response);
    //run getKoalas to show updated koala on DOM
    getKoalas();
  }).catch(function(err){
    console.log(err);
    alert('Error changing ready to transfer status');
  })
}
