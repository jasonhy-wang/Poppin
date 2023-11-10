document.addEventListener("DOMContentLoaded", function () {
    const dropZone = document.querySelector(".flex.flex-col.w-full.p-8");
    const fileInput = document.getElementById("file-upload");
    const uploadText = document.getElementById("upload-text");
    const imagePreview = document.getElementById("image-preview");
    const uploadIcon = document.getElementById("upload-icon");

    if (dropZone) {
        dropZone.addEventListener("dragover", function (e) {
            e.preventDefault();
        });

        dropZone.addEventListener("drop", function (e) {
            e.preventDefault();

            if (e.dataTransfer.items && e.dataTransfer.items[0].kind === "file") {
                const file = e.dataTransfer.items[0].getAsFile();
                const dt = new DataTransfer();
                dt.items.add(file);
                fileInput.files = dt.files;
                previewImage(file);
            }
        });

        fileInput.addEventListener("change", function () {
            const file = fileInput.files[0];
            if (file) {
                previewImage(file);
            }
        });

        function previewImage(file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagePreview.src = e.target.result;
                imagePreview.classList.remove("hidden");
                uploadIcon.classList.add("hidden");
                uploadText.textContent = "Replace image";
            };
            reader.readAsDataURL(file);
        }
}
    var input = document.querySelector("#tags");
    if (input){
        // Initialize Tagify with maxTags setting
        var tagify = new Tagify(input, {
            delimiters: ", ",
            maxTags: 5
        });

        // Add an event listener to notify the user when they've reached the max number of tags
        tagify.on('input', function (e) {
            if (tagify.value.length >= tagify.settings.maxTags) {
                showErrorTooltip(input, 'You have reached the maximum number of allowed tags!');
            }
        });
}


    function showErrorTooltip(inputElement, message) {
        // Create a tippy instance
        const tip = tippy(inputElement, {
            content: message,
            trigger: 'manual',
            placement: 'top'
        });

        // Show the tooltip
        tip.show();

        // Hide the tooltip after a delay (e.g., 5 seconds)
        setTimeout(() => {
            tip.hide();
            tip.destroy(); // Properly clean up the tippy instance
        }, 5000);
    }
    const email_input = document.querySelector('#email')
    if (email_input){
        document.getElementById('sendCode').addEventListener('click', function(event) {
            event.preventDefault();

            var email = document.getElementById('email').value;
            fetch('/send_verification_code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email: email}),
            })
            .then(response => response.json())
            .then(data => {
                showErrorTooltip(document.querySelector("#email"), data.message);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        });
    }

// Search integration
function performSearch(event) {
    const search = document.getElementById('search_query');
    const search_2 = document.getElementById('search_query_2');
    if (search) {
        searchInput = search
    }
    if (search_2) {
        searchInput = search_2
    }
    let query = searchInput.value;
    window.location.href = '/search?search_query=' + encodeURIComponent(query);
}


const search = document.getElementById('search_query');
const suggestions = document.getElementById('suggestions');

const search_2 = document.getElementById('search_query_2');
const suggestions_2 = document.getElementById('suggestions_2');

function setupSearchInput(searchInput, suggestionsBox) {
    searchInput.addEventListener("input", function(event) {
        const value = event.target.value;
        suggestionsBox.innerHTML = "";

        if (value === "") {
            suggestionsBox.classList.add('hidden');
            return;
        }

        // Fetching data from the server
        fetch(`/autocomplete?search_query=${value}`)
        .then(response => response.json())
        .then(data => {
            if(data.length) {
                suggestionsBox.classList.remove('hidden');
            } else {
                suggestionsBox.classList.add('hidden');
            }

            const ulElement = document.createElement("ul");
            ulElement.classList.add("text-sm", "text-gray-700", "dark:text-gray-200", "border-2", "border-blue-500", "rounded-lg", "shadow-2xl");

            data.forEach(item => {
                const liElement = document.createElement("li");
                liElement.textContent = item.name;
                liElement.classList.add("hover:bg-gray-200", "cursor-pointer", "px-4", 'py-2', 'hover:bg-gray-100', 'dark:hover:bg-gray-600', 'dark:hover:text-white', "rounded-lg");

                liElement.addEventListener("click", function() {
                    searchInput.value = item.name;
                    suggestionsBox.innerHTML = "";
                    suggestionsBox.classList.add('hidden');
                    performSearch();
                });

                ulElement.appendChild(liElement);
            });

            suggestionsBox.appendChild(ulElement);
        })
        .catch(error => {
            console.error("Error fetching search results:", error);
        });
    });
}

if (search) {
    setupSearchInput(search, suggestions);
}

if (search_2) {
    setupSearchInput(search_2, suggestions_2);
}

function initialize() {
    var input = document.getElementById('location');
    if (input) {
        var options = {
            componentRestrictions: { country: 'CA' }  // Restrict results to Canada
        };

            var autocomplete = new google.maps.places.Autocomplete(input, options);

            // Bias results towards Toronto 
            var torontoBounds = new google.maps.LatLngBounds(
                new google.maps.LatLng(43.5800, -79.6393), // Southwest corner of Toronto
                new google.maps.LatLng(43.8555, -79.1169)  // Northeast corner of Toronto
            );
            autocomplete.setBounds(torontoBounds);

            // Add an event listener for place_changed
            google.maps.event.addListener(autocomplete, 'place_changed', function () {
                var place = autocomplete.getPlace();
                if (!place.place_id) {
                    showErrorTooltip(input, "Please select a valid location from the dropdown.");
                    input.value = "";  // Clear the input
                }
            });
        }
    }
    var input = document.getElementById('location');
    if (input){
        // Get the start and end time select elements
        const startTimeSelect = document.getElementById('start-time');
        const endTimeSelect = document.getElementById('end-time');

        // Function to check and validate times
        function validateTimes() {
            const startTimeValue = parseInt(startTimeSelect.value, 10);
            const endTimeValue = parseInt(endTimeSelect.value, 10);

            if (endTimeValue <= startTimeValue) {
                showErrorTooltip(endTimeSelect, 'End time should be after start time');
                endTimeSelect.value = ''; // Clear the end time selection
            }
        }

        // Add event listeners to check the times whenever they change
        startTimeSelect.addEventListener('change', validateTimes);
        endTimeSelect.addEventListener('change', validateTimes);


        // Call the initialize function when the window loads.
        google.maps.event.addDomListener(window, 'load', initialize);
    }
});

function like(event_id) {
    const likeCount = document.getElementById("like-count")
    const likeButton = document.getElementById("like-button")
    const heartIcon = document.getElementById("heart-icon");

    fetch(`/like_event/${event_id}`, { method: "POST" }).then((res) => res.json()).then((data) => {
        likeCount.innerHTML = data["like_count"]
        if (data["user_has_liked"] === true) {
            heartIcon.classList.remove("fa-regular");
            heartIcon.classList.add("fa-solid");
        }
        else {
            heartIcon.classList.remove("fa-solid");
            heartIcon.classList.add("fa-regular");
        }
    });
}


function comment(event_id) {
    var commentText = document.getElementById("comment").value;
    var commentSection = document.getElementById("comment-display");
    fetch(`/create_comment/${event_id}`, { 
        method: "POST", 
        body: JSON.stringify({ comment: commentText }),
        headers: {
            "Content-Type": "application/json"
        }, 
    }).then((res) => res.json()).then((data) => {
        commentText = data["comment"]["text"];
        commentAuthor = data["comment"]["author"];
        commentDateTimeCreated = data["comment"]["datetime_created"];
        newCommentHTML = `
        <article class="p-6 mb-6 text-base bg-white border-t border-gray-200 rounded-lg dark:bg-gray-900">
            <footer class="flex justify-between items-center mb-2">
                <div class="flex items-center">
                    <p class="inline-flex items-center mr-3 font-semibold text-sm text-gray-900 dark:text-white"><img class="mr-2 w-6 h-6 rounded-full"
                        src="https://flowbite.com/docs/images/people/profile-picture-2.jpg" alt="Comment author">${commentAuthor}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">${moment(commentDateTimeCreated).format("MMM D, YYYY @ h:mma")}</p>
                </div>
            </footer>
            <p>${commentText}</p>
            <div class="flex items-center mt-4 space-x-4">
                <button type="button" class="flex items-center font-medium text-sm text-gray-500 hover:underline dark:text-gray-400">
                    <svg class="mr-1.5 w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                        <path
                            d="M18 0H2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2v4a1 1 0 0 0 1.707.707L10.414 13H18a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5 4h2a1 1 0 1 1 0 2h-2a1 1 0 1 1 0-2ZM5 4h5a1 1 0 1 1 0 2H5a1 1 0 0 1 0-2Zm2 5H5a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Zm9 0h-6a1 1 0 0 1 0-2h6a1 1 0 1 1 0 2Z" />
                    </svg>
                    Reply
                </button>
            </div>
        </article>
        `;
        commentSection.insertAdjacentHTML("beforeend", newCommentHTML);
        document.getElementById("comment").value = "";
    });
}

function rsvp(event_id) {
    const rsvpButton = document.getElementById("rsvp-button");
    const rsvpCount = document.getElementById("rsvp-count");
    const rsvpGrammar = document.getElementById("rsvp-count-grammar");
    fetch(`/rsvp_event/${event_id}`, { method: "POST" }).then((res) => res.json()).then((data) => {
        rsvpCount.innerHTML = data["rsvp_count"]
        if (parseInt(data["rsvp_count"]) == 1) {rsvpGrammar.innerHTML = "person is"} else {rsvpGrammar.innerHTML = "people are"}
        if (data["user_has_rsvp"] === true) {
            rsvpButton.classList.remove("text-blue-700");
            rsvpButton.classList.add("text-white", "bg-blue-700");
            rsvpButton.innerHTML = "RSVP'd";
        }
        else {
            rsvpButton.classList.remove("text-white", "bg-blue-700");
            rsvpButton.classList.add("text-blue-700");
            rsvpButton.innerHTML = "RSVP";
        }
    });
}
