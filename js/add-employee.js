$(document).ready(function () {
    const addEmployeeUrl = "http://localhost:8080/api/employee";
    const getAllJobTitlesUrl = "http://localhost:8080/api/job-title/status/true";
    const getAllDepartmentsUrl = "http://localhost:8080/api/department/status/true";
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: 'Bearer ' + token } : {};
    let selectedJobTitleId;
    let selectedDepartmentId;
    let jobTitleData;
    let departmentData;

    function populateDropdown(url, selectElement) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "GET",
                url: url,
                headers: headers,
                success: function (responseData) {
                    selectElement.empty();
                    responseData.forEach(item => {
                        selectElement.append($("<option>").val(item.name || item.title).text(item.name || item.title));
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

    // Populate job titles dropdown
    populateDropdown(getAllJobTitlesUrl, $("#jobTitle"))
        .then(function (data) {
            jobTitleData = data; // Assign fetched job title data
        })
        .catch(function (error) {
            console.error("Error fetching job titles:", error);
        });

    // Populate departments dropdown
    populateDropdown(getAllDepartmentsUrl, $("#department"))
        .then(function (data) {
            departmentData = data; // Assign fetched department data
        })
        .catch(function (error) {
            console.error("Error fetching departments:", error);
        });

    $("#jobTitle").change(function () {
        const selectedTitle = $(this).val();
        console.log("Selected job title:", selectedTitle);
        const selectedJob = jobTitleData.find(item => item.title === selectedTitle);
        selectedJobTitleId = selectedJob ? selectedJob.id : null;
        console.log("Selected job title ID:", selectedJobTitleId);
    });

    $("#department").change(function () {
        const selectedDepartment = $(this).val();
        console.log("Selected department:", selectedDepartment);
        const selectedDep = departmentData.find(item => item.name === selectedDepartment);
        selectedDepartmentId = selectedDep ? selectedDep.id : null;
        console.log("Selected department ID:", selectedDepartmentId);
    });

    $("#submitButton").click(function (event) {
        event.preventDefault();

        const firstName = $("#firstName").val();
        const lastName = $("#lastName").val();
        const phone = $("#phone").val();
        const address = $("#address").val();
        // Format date of birth in YYYY-MM-DD format
        const dob = new Date($("#dob").val()).toISOString().slice(0, 10);

        // Format hire date in YYYY-MM-DD format
        const hireDate = new Date($("#hireDate").val()).toISOString().slice(0, 10);

        // Parse selectedJobTitleId and selectedDepartmentId as integers
        const parsedJobTitleId = parseInt(selectedJobTitleId);
        const parsedDepartmentId = parseInt(selectedDepartmentId);

        const dataToSend = {
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phone,
            address: address,
            dateOfBirth: dob,
            hireDate: hireDate,
            jobTitle: {
                id: parsedJobTitleId
            },
            department: {
                id: parsedDepartmentId
            }
        };

        console.log("Payload object:", dataToSend);

        $.ajax({
            type: "POST",
            url: addEmployeeUrl,
            contentType: "application/json",
            headers: headers,
            data: JSON.stringify(dataToSend),
            success: function (response) {
                console.log("Employee added successfully");
                window.location.href = "home.html";
            },
            error: function (errorThrown) {
                console.error("Failed to add employee");
                console.error("Error:", errorThrown);
            },
        });
    });
});
