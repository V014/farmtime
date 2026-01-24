$(document).ready(function() {
    // Define repetitive HTML in a variable
    const footerTemplate = `
        <div id="layoutAuthentication_footer">
            <footer class="py-4 bg-light mt-auto">
                <div class="container-fluid px-4">
                    <div class="d-flex align-items-center justify-content-between small">
                        <div class="text-muted">FarmTime &copy;</div>
                        <div>
                            <a href="#">Privacy Policy</a>
                            &middot;
                            <a href="#">Terms &amp; Conditions</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    `;

    // Inject it into the placeholder
    $('#footer-placeholder').html(footerTemplate);

    // Highlighting the active link (Optional but cool)
    const currentPage = window.location.pathname.split("/").pop();
    $(`#footer-placeholder a[href="${currentPage}"]`).css("font-weight", "bold");
});