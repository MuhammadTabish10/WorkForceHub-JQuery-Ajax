$(document).ready(function () {
    const getAllUrl = "http://localhost:8080/api/employee/status/true";
    const deleteUrl = "http://localhost:8080/api/employee/";
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: 'Bearer ' + token } : {};

    function populateEmployeeTable() {
        $.ajax({
            type: "GET",
            url: getAllUrl,
            headers: headers,
            success: function (data) {
                // Clear previous table rows
                $("#employeeTable tbody").empty();

                // Populate table with fetched data
                $.each(data, function (index, employee) {
                    let row = $("<tr>");
                    row.append($("<td>").text(employee.firstName));
                    row.append($("<td>").text(employee.lastName));
                    row.append($("<td>").text(employee.phoneNumber));
                    row.append($("<td>").text(employee.address));
                    row.append($("<td>").text(employee.dateOfBirth));
                    row.append($("<td>").text(employee.hireDate));
                    row.append($("<td>").text(employee.jobTitle.title));
                    row.append($("<td>").text(employee.department.name));
                    row.append(`<td class="text-center">
                                    <div class="btn-group" role="group" aria-label="Actions"> 
                                        <a href="edit-employee.html?id=${employee.id}" class="btn btn-info btn-circle mr-2 action-btn">Edit</a>
                                        <button class="btn btn-danger btn-circle action-btn deleteBtn" data-id="${employee.id}">Delete</button>
                                    </div>
                                </td>`);

                    $("#employeeTable tbody").append(row);
                });
            },
            error: function (xhr, textStatus, errorThrown) {
                console.error("Error:", errorThrown);
            }
        });
    }

    // Event listener for delete button clicks
    $(document).on("click", ".deleteBtn", function () {
        let id = $(this).data("id");
        deleteEmployee(id);
    });

    function deleteEmployee(id) {
        $.ajax({
            type: "DELETE",
            url: deleteUrl + id,
            headers: headers,
            success: function (data) {
                console.log("Employee Deleted:", data);
                populateEmployeeTable();
            },
            error: function (errorThrown) {
                console.error("Error:", errorThrown);
            }
        });
    }
    populateEmployeeTable();
});
