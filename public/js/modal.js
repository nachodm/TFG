
$('#orderModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var nam = button.data('nombre')
    var id = button.data('id')
    var surnam = button.data('apellidos')  // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this)
    modal.find('.name').text(nam)
    modal.find('.surname').text(surnam)
    modal.find('#orderModalLabel').text(id)
    modal.find(".hid").val(id);
})
