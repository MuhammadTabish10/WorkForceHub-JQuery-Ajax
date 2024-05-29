$(document).ready(function () {
    const editEmployeeUrl = "http://localhost:8080/api/employee/";
    const getAllJobTitlesUrl = "http://localhost:8080/api/job-title/status/true";
    const getAllDepartmentsUrl = "http://localhost:8080/api/department/status/true";
    let selectedJobTitleId;
    let selectedDepartmentId;

    // Retrieve token from localStorage
    const token = localStorage.getItem('token');

    // Prepare headers
    const headers = token ? { Authorization: 'Bearer ' + token } : {};

    // Get employee ID from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const employeeId = urlParams.get('id');

    // Function to fetch employee details and populate the form
    function populateEmployeeDetails() {
        $.ajax({
            type: "GET",
            url: editEmployeeUrl + employeeId,
            headers: headers,
            success: function (data) {
                // Populate form with fetched employee details
                $("#firstName").val(data.firstName);
                $("#lastName").val(data.lastName);
                $("#phone").val(data.phoneNumber);
                $("#address").val(data.address);
                $("#dob").val(data.dateOfBirth);
                $("#hireDate").val(data.hireDate);

                selectedJobTitleId = data.jobTitle.id;
                selectedDepartmentId = data.department.id;

                // Populate job titles dropdown
                populateDropdown(getAllJobTitlesUrl, $("#jobTitle"), data.jobTitle.id)
                    .catch(function (error) {
                        console.error("Error fetching job titles:", error);
                    });

                // Populate departments dropdown
                populateDropdown(getAllDepartmentsUrl, $("#department"), data.department.id)
                    .catch(function (error) {
                        console.error("Error fetching departments:", error);
                    });
            },
            error: function (errorThrown) {
                console.error("Error:", errorThrown);
            }
        });
    }

    // Call function to populate form with employee details on page load
    populateEmployeeDetails();

    // Function to fetch and populate dropdown with data
    function populateDropdown(url, selectElement, selectedId) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "GET",
                url: url,
                headers: headers,
                success: function (responseData) {
                    selectElement.empty();
                    responseData.forEach(item => {
                        const option = $("<option>").val(item.id).text(item.name || item.title);
                        if (item.id === selectedId) {
                            option.prop('selected', true);
                        }
                        selectElement.append(option);
                    });
                    resolve(responseData);
                },
                error: function (errorThrown) {
                    console.error(`Error fetching data from ${url}: ${errorThrown}`);
                    reject(errorThrown);
                }
            });
        });
    }

    // Event listener for job title dropdown change
    $("#jobTitle").change(function () {
        // Update selectedJobTitleId
        selectedJobTitleId = parseInt($(this).val());
    });

    // Event listener for department dropdown change
    $("#department").change(function () {
        // Update selectedDepartmentId
        selectedDepartmentId = parseInt($(this).val());
    });

    // Event listener for form submission
    $("#editEmployeeForm").submit(function (event) {
        event.preventDefault();

        // Get form data
        const formData = {
            firstName: $("#firstName").val(),
            lastName: $("#lastName").val(),
            phoneNumber: $("#phone").val(),
            address: $("#address").val(),
            dateOfBirth: $("#dob").val(),
            hireDate: $("#hireDate").val(),
            status: $("#status").val() === "Active",
            jobTitle: {
                id: selectedJobTitleId
            },
            department: {
                id: selectedDepartmentId
            }
        };

        // Send PUT request to update employee details
        $.ajax({
            type: "PUT",
            url: editEmployeeUrl + employeeId,
            headers: headers,
            contentType: "application/json",
            data: JSON.stringify(formData),
            success: function (data) {
                console.log("Employee updated successfully:", data);
                // Redirect to home page after successful update
                window.location.href = "home.html";
            },
            error: function (errorThrown) {
                console.error("Error updating employee:", errorThrown);
            }
        });
    });
});
