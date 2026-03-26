document.addEventListener('DOMContentLoaded', function () {
    var gameNameHeading = document.getElementById('gamename');
    gameNameHeading.addEventListener('click', function () {
        Swal.fire({
            title: 'Cheese Escape',
            text: 'Author: Gašper Levpušček',
            confirmButtonText: 'ok',
            confirmButtonColor: '#ffe70b',
            didOpen: function (popup) {
                var confirmButton = popup.querySelector('.swal2-confirm');

                if (confirmButton) {
                    confirmButton.style.color = '#000000';
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.reload();
            }


        });
    });
});