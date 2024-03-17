document.addEventListener("DOMContentLoaded", function () {
    const addCardBtn = document.getElementById("addCardBtn");
    const cardContainer = document.getElementById("cardContainer");
    const deleteAllBtn = document.getElementById("delAllCardBtn");
    let previousTheme = null;

    function exportToPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        let y = 10; // Vertical position to start adding text lines
        document.querySelectorAll('.card').forEach((card, index) => {
            const title = card.querySelector('.title').value;
            const description = card.querySelector('.description').value;
            const dateandtime = card.querySelector('.dateandtime').value;
            const event = card.querySelector('.event').value;
            const nearestplace = card.querySelector('.nearestplace').value;
            doc.text(`Card ${index + 1}: ${title}, ${description}, ${dateandtime}, ${event}, ${nearestplace}`, 10, y);
            y += 10; // Move to the next line for each card
        });

        doc.save('cards.pdf');
    }


    function exportToExcel() {
        const wb = XLSX.utils.book_new();
        const ws_data = [['Title', 'Description', 'Date and Time', 'Event', 'Nearest Place']]; // Header row

        document.querySelectorAll('.card').forEach(card => {
            const title = card.querySelector('.title').value;
            const description = card.querySelector('.description').value;
            const dateandtime = card.querySelector('.dateandtime').value;
            const event = card.querySelector('.event').value;
            const nearestplace = card.querySelector('.nearestplace').value;
            ws_data.push([title, description, dateandtime, event, nearestplace]); // Add row per card
        });

        const ws = XLSX.utils.aoa_to_sheet(ws_data);
        XLSX.utils.book_append_sheet(wb, ws, "Cards");
        XLSX.writeFile(wb, 'cards.xlsx');
    }


    function handleShare(e) {
        e.preventDefault();
        const card = this.closest('.card');
        const title = card.querySelector('.title').value || 'Check out this card!';
        const description = card.querySelector('.description').value || 'This is a great card from our collection.';
        const dateandtime = card.querySelector('.dateandtime').value || '';
        const event = card.querySelector('.event').value || '';
        const nearestplace = card.querySelector('.nearestplace').value || '';
        let shareContent = `${title} - ${description}`;
        if (dateandtime) shareContent += ` Date and Time: ${dateandtime}`;
        if (event) shareContent += ` Event: ${event}`;
        if (nearestplace) shareContent += ` Nearest Place: ${nearestplace}`;
        let shareURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareContent)}`;
        window.open(shareURL, '_blank');
    }


   
    function addCard() {
        let cardsData = JSON.parse(localStorage.getItem("cards")) || [];
        // Implement logic to add a new card
        const newCard = document.createElement("div");
        
        newCard.classList.add("card");
        newCard.innerHTML = `
        <form>
        <input class="title" type="text" placeholder="Title" readonly disabled>
        <input class="description" type="text" placeholder="Description"readonly disabled>
        <input class="dateandtime" type="text" placeholder="Date and Time"readonly disabled>
        <input class="event" type="text" placeholder="Event"readonly disabled>
        <input class="nearestplace" type="text" placeholder="Nearest Place"readonly disabled>
        </form>
        <img class="profilePic"src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg" alt="image">
        <button class="deleteBtn">Delete</button>
        <button class="editBtn">Edit</button>
        <button class="viewBtn">View</button>
        <button class="shareBtn">Share</button>
        <button class="pdfBtn">Export Pdf</button>
        <button class="excelBtn">Export Excel</button>
        <div class="changeTheme">
        <button class="changeThemeBtn">Change Theme </button>
        <ul class="themeOptions">
          <li class="option" data-theme="1">Black background, white text color, sky blue button color</li>
          <li class="option" data-theme="2">Yellow background, black text color, green button color</li>
          <li class="option" data-theme="3">Dark blue background, white text color, light blue button color</li>
        </ul>
        </div>
      `;


        cardContainer.appendChild(newCard);

        const shareBtn = newCard.querySelector(".shareBtn");
        shareBtn.addEventListener("click", handleShare);

        const pdfBtn = newCard.querySelector(".pdfBtn");
        pdfBtn.addEventListener("click", function () {
            exportToPDF(); // This will export all cards to PDF
        });

        const excelBtn = newCard.querySelector(".excelBtn");
        excelBtn.addEventListener("click", function () {
            exportToExcel(); // This will export all cards to Excel
        });


        function editCard() {
            document.querySelectorAll('.editBtn').forEach(item => {
                const card = item.closest('.card');
                const inputs = card.querySelectorAll('input');

                if (item.textContent === 'Edit') {
                    inputs.forEach(input => {
                        input.removeAttribute('readonly');
                        input.removeAttribute('disabled');
                    });
                    item.textContent = 'Save';
                } else {
                    inputs.forEach(input => {
                        input.setAttribute('readonly', true);
                        input.setAttribute('disabled', true);
                    });
                    item.textContent = 'Edit';
                }
            });
        }

        // Add event listeners to buttons inside the new card
        const editBtn = newCard.querySelector(".editBtn");
        editBtn.addEventListener("click", function () {
            editCard(newCard);
        });



        function searchCard(searchText) {
            const searchQuery = searchText.toLowerCase();

            // Iterate through each card
            document.querySelectorAll('.card').forEach(card => {
                let cardContainsSearchText = false;

                card.querySelectorAll('input').forEach(input => {
                    const inputValue = input.value.toLowerCase();
                    if (inputValue.includes(searchQuery)) {
                        cardContainsSearchText = true;
                    }
                });
                card.style.display = cardContainsSearchText ? "block" : "none";
            });
        }


        const searchInput = document.getElementById("searchInput");
        searchInput.addEventListener("input", function () {
            const searchText = this.value;
            searchCard(searchText);
        });

        const searchBtn = document.getElementById("searchBtn");
        searchBtn.addEventListener("click", function () {
            const searchText = searchInput.value;
            searchCard(searchText);
        });


        const advancedFilterBtn = document.getElementById("b2");
        const advancedFilterDiv = document.getElementById("advancedFilter");

        function toggleAdvancedFilterDisplay(show) {
            if (show) {
                advancedFilterDiv.style.display = "block";
                advancedFilterBtn.style.display = "none";
            } else {
                advancedFilterDiv.style.display = "none";
                advancedFilterBtn.style.display = "block";
            }
        }

        toggleAdvancedFilterDisplay(false);

        advancedFilterBtn.addEventListener("click", function () {
            toggleAdvancedFilterDisplay(true);
        });

        const searchAdvancedBtn = document.getElementById("searchAdvancedBtn");
        searchAdvancedBtn.addEventListener("click", function () {
            const titleInput = document.getElementById("searchTitleInput").value.toLowerCase();
            const descriptionInput = document.getElementById("searchDescriptionInput").value.toLowerCase();
            const dateTimeInput = document.getElementById("searchDateTimeInput").value.toLowerCase();
            const eventInput = document.getElementById("searchEventInput").value.toLowerCase();
            const nearestPlaceInput = document.getElementById("searchNearestPlaceInput").value.toLowerCase();

            document.querySelectorAll('.card').forEach(card => {
                let matchesFilter = false;
                const title = card.querySelector('.title').value.toLowerCase();
                const description = card.querySelector('.description').value.toLowerCase();
                const dateTime = card.querySelector('.dateandtime').value.toLowerCase();
                const event = card.querySelector('.event').value.toLowerCase();
                const nearestPlace = card.querySelector('.nearestplace').value.toLowerCase();

                if ((titleInput && title.includes(titleInput)) ||
                    (descriptionInput && description.includes(descriptionInput)) ||
                    (dateTimeInput && dateTime.includes(dateTimeInput)) ||
                    (eventInput && event.includes(eventInput)) ||
                    (nearestPlaceInput && nearestPlace.includes(nearestPlaceInput))) {
                    matchesFilter = true;
                }

                card.style.display = matchesFilter ? "block" : "none";
            });
        });

        const resetAdvancedBtn = document.getElementById("resetAdvancedBtn");
        resetAdvancedBtn.addEventListener("click", function () {
            document.getElementById("searchTitleInput").value = '';
            document.getElementById("searchDescriptionInput").value = '';
            document.getElementById("searchDateTimeInput").value = '';
            document.getElementById("searchEventInput").value = '';
            document.getElementById("searchNearestPlaceInput").value = '';

            document.querySelectorAll('.card').forEach(card => {
                card.style.display = "block";
            });
            toggleAdvancedFilterDisplay(false);
        });


        function applyRandomTheme(card) {
            let randomThemeIndex;
            do {
                randomThemeIndex = Math.floor(Math.random() * 4) + 1;
            } while (randomThemeIndex === previousTheme);
            applyTheme(card, randomThemeIndex.toString());
            previousTheme = randomThemeIndex;
        }

        function applyTheme(card, theme) {
            switch (theme) {
                case "1":
                    applyStyles(card, "Arial", "normal", "white", "", "darkblue");
                    card.querySelectorAll("button").forEach(function (button) {
                                    button.style.backgroundColor = "black";
                                    button.style.color = "white";
                    });
                    card.querySelectorAll("input").forEach(function (input) {
                                    input.style.backgroundColor = "darkblue";
                                    input.style.color = "white";
                     });
                    break;
                case "2":
                    applyStyles(card, "Tahoma", "normal", "white", "white", "green");
                    card.querySelectorAll("button").forEach(function (button) {
                                    button.style.backgroundColor = "white";
                                    button.style.color = "black";
                    });
                    card.querySelectorAll("input").forEach(function (input) {
                        input.style.backgroundColor = "green";
                        input.style.color = "white";
                    });
                    break;

                case "3":
                    applyStyles(card, "Calibri", "normal", "white", "white", "gray");
                    card.querySelectorAll("button").forEach(function (button) {
                        button.style.backgroundColor = "#262F30";
                        button.style.color = "white";
                    });
                    card.querySelectorAll("input").forEach(function (input) {
                        input.style.backgroundColor = "#262F30";
                        input.style.color = "white";
                    });
                    break;

                    case "4":
                        applyStyles(card, "Verdana", "normal", "white", "white", "black");
                        card.querySelectorAll("button").forEach(function (button) {
                                    button.style.backgroundColor = "white";
                                    button.style.color = "black";
                        });
                        card.querySelectorAll("input").forEach(function (input) {
                            input.style.backgroundColor = "white";
                            input.style.color = "black";
                        });
                    break;
            }
        }

        function applyStyles(card, fontName, fontStyle, fontColor, bodyColor, backgroundColor) {
            card.style.fontFamily = fontName;
            card.style.fontStyle = fontStyle;
            card.style.color = fontColor;
            card.style.backgroundColor = backgroundColor;
            document.body.style.backgroundColor = bodyColor;

            card.querySelectorAll("button").forEach(function (button) {
                button.style.backgroundColor = backgroundColor;
                button.style.color = fontColor;
                button.style.fontFamily = fontName;
            });

            card.querySelectorAll("input").forEach(function (input) {
                input.style.backgroundColor = backgroundColor;
                input.style.color = fontColor;
                input.style.fontFamily = fontName;
            });
        }

        const changeThemeBtn = newCard.querySelector(".changeThemeBtn");
        changeThemeBtn.addEventListener("click", function () {
            applyRandomTheme(newCard);
        });

        const themeOptions = newCard.querySelectorAll(".option");
        themeOptions.forEach(function (option) {
            option.addEventListener("click", function () {
                applyTheme(newCard, option.dataset.theme);
            });
        });

        function toggleCardView(card) {
            card.classList.toggle("fullscreen");
            const viewBtn = card.querySelector(".viewBtn");
            const shareBtn = card.querySelector(".shareBtn");
            const pdfBtn = card.querySelector(".pdfBtn");
            const excelBtn = card.querySelector(".excelBtn");

            if (card.classList.contains("fullscreen")) {
                viewBtn.textContent = "Exit Fullscreen";
                deleteBtn.style.display = "inline-block";
                editBtn.style.display = "inline-block";
                viewBtn.style.display = "inline-block";
                changeThemeBtn.style.display = "inline-block";
                shareBtn.style.display = "none";
                pdfBtn.style.display = "none";
                excelBtn.style.display = "none";
            } else {
                viewBtn.textContent = "View";
                deleteBtn.style.display = "flex";
                editBtn.style.display = "flex";
                viewBtn.style.display = "flex";
                shareBtn.style.display = "flex";
                pdfBtn.style.display = "flex";
                excelBtn.style.display = "flex";
                changeThemeBtn.style.display = "none";
            }
        }

        const viewBtn = newCard.querySelector(".viewBtn");
        viewBtn.addEventListener("click", function () {
            toggleCardView(newCard);
        });


        function uploadProfilePicture(profilePic) {
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = "image/*";
            fileInput.addEventListener("change", function (event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        profilePic.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });
            fileInput.click();
        }
        const profilePic = newCard.querySelector(".profilePic");
        profilePic.addEventListener("click", function () {
            uploadProfilePicture(profilePic);
        });

            const deleteBtn = newCard.querySelector(".deleteBtn");
            deleteBtn.addEventListener("click", function () {
                newCard.remove();
            });
        }

        if (!addCardBtn.hasEventListener) {
            addCardBtn.addEventListener("click", addCard);
            addCardBtn.hasEventListener = true;
        }

        deleteAllBtn.addEventListener("click", function () {
            const cards = document.querySelectorAll(".card");
            cards.forEach(function (card) {
                card.remove();
            });




        });
    });






