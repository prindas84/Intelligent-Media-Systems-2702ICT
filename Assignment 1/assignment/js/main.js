document.addEventListener('DOMContentLoaded', function () {

    // Declare the path to the JSON file.
    let database = 'database/db.json';

    // Declare the FLICKR API Key
    let FLICKR_API_KEY = 'api_key=64890d26e94405ff42557bbd08fd7da0';

    // Declare the number of thumbnails to display on a destination page, recently viewed section, and the recently viewed array.
    let thumbnail_count = 12;
    let error_margin = 5;
    let recently_viewed_count = 5
    let recently_viewed = [];

    // Get the sections required for the code functionality below.
    let destinations_menu = document.querySelector('.destinations-menu');
    let dropdown_menu = document.querySelector('.dropdown-menu');
    let mobile_dropdown_menu = document.querySelector('.mobile-dropdown-menu');
    let mobile_menu_icon = document.querySelector('.mobile-menu-icon');
    let mobile_menu_closed = document.querySelector('.mobile-menu-closed');
    let mobile_menu_dropdown = document.querySelector('.mobile-menu-section');
    let display_section = document.querySelector('.destination-list');
    let homepage_banner = document.querySelector('.homepage-banner');
    let homepage_content = document.querySelector('.homepage-content');
    let destination_section = document.querySelector('.destination-section');
    let destination_banner = document.querySelector('.destination-display-banner');
    let destination_content = document.querySelector('.destination-display-content');
    let destination_gallery = document.querySelector('.destination-photo-gallery');
    let destination_gallery_section = document.querySelector('.destination-gallery-section');
    let destination_attractions_section = document.querySelector('.destination-attractions-section');
    let destination_attractions_title = document.querySelector('.destination-attraction-title');
    let attractions_list = document.querySelector('.destination-attractions-list');
    let recently_viewed_section = document.querySelector('.recently-viewed-section');
    let recently_viewed_content = document.querySelector('.recently-viewed-list');
    let modal_container = document.getElementById('modal-container');
    let modal_content = document.getElementById('modal-content');
    let modal_caption = document.getElementById('modal-caption');



    // ----------------- PROCESS THE DATABASE INFORMATION ----------------- //
    fetch(database)
        .then(response => response.json())
        .then(data => {
            data.destinations.forEach((destination, index) => {

                // CREATE THE DROPDOWN MENU
                // Create HTML elements programmatically and append them to the dropdown menu.
                let destination_item = document.createElement('li');
                // Create the a element.
                let destination_link = document.createElement('a');
                destination_link.textContent = destination.name;
                // Append link to the list item.
                destination_item.appendChild(destination_link);
                // Clone the div so far so we can append to the mobile and desktop menus accordingly.
                let mobile_destination_item = destination_item.cloneNode(true);
                // Add the click listener for desktop.
                destination_link_click(destination_item, index);
                // Add the click listener for mobile.
                destination_link_click_mobile(mobile_destination_item, index);
                // Append list item to the dropdown menu.
                dropdown_menu.appendChild(destination_item);
                mobile_dropdown_menu.appendChild(mobile_destination_item);

                // POPULATE THE DESTINATION LIST
                // Create list items programmatically to append to the destination list.
                let destination_display = document.createElement('div');
                destination_display.classList.add('destination-display');
                // Create the image content.
                let destination_list = document.createElement('div');
                destination_list.classList.add('destination-image');

                // Get the URL from flickr for the main image.
                get_main_image(destination.main_image, 'small').then(url => {
                    // Image div (img)
                    let destination_list_image_a = document.createElement('a');
                    let destination_list_image = document.createElement('img');
                    destination_list_image.setAttribute('src', url);
                    destination_list_image.setAttribute('alt', destination.name);
                    destination_list_image_a.appendChild(destination_list_image);
                    destination_list.appendChild(destination_list_image_a);
                    // Add the click listener.
                    destination_link_click(destination_list_image_a, index);
                }).catch(error => {
                    console.error('Failed to get main image URL: ', error);
                });

                // Create the textual content.
                let destination_content = document.createElement('div');
                destination_content.classList.add('destination-content');
                // Header div (h4)
                let destination_content_header_a = document.createElement('a');
                let destination_content_h4 = document.createElement('h4');
                destination_content_h4.textContent = destination.name;
                destination_content_header_a.appendChild(destination_content_h4);
                // Add the click listener.
                destination_link_click(destination_content_header_a, index);
                // Text div (p)
                let destination_content_text = document.createElement('div');
                let destination_content_p = document.createElement('p');
                destination_content_p.textContent = destination.short;
                destination_content_text.appendChild(destination_content_p);
                // Button div (a)
                let destination_content_button = document.createElement('div');
                destination_content_button.classList.add('destination-button');
                let destination_content_a = document.createElement('a');
                destination_content_a.textContent = 'View Destination';
                destination_content_button.appendChild(destination_content_a);
                // Add the click listener.
                destination_link_click(destination_content_a, index);
                // Bring the content together.
                destination_content.appendChild(destination_content_header_a);
                destination_content.appendChild(destination_content_text);
                destination_content.appendChild(destination_content_button);
                // Bring it all together as one div.
                destination_display.appendChild(destination_list);
                destination_display.appendChild(destination_content);
                display_section.appendChild(destination_display);
            });
        })
        .catch(error => {
            console.log('Dropdown List Error: ', error);
        });



    // ----------------- DROP-DOWN MENU HOVER FUNCTIONALITY ----------------- //
    // Function to display the drop-down menu.
    let timeout;
    function display_dropdown_menu() {
        dropdown_menu.style.display = 'block';
    }

    /* Function to hide the drop-down menu after a short delay. 
    This will mitigate small instances where the mouseover doesn't match the menu item or the drop-down.*/
    function hide_dropdown_menu() {
        timeout = setTimeout(function () {
            dropdown_menu.style.display = 'none';
        }, 200);
    }

    // Display drop-down menu on hover over menu item.
    destinations_menu.addEventListener('mouseenter', function () {
        // Cancel any existing timeout. Show the drop-down menu.
        clearTimeout(timeout);
        display_dropdown_menu();
    });

    // Hide the drop-down menu after a short delay.
    destinations_menu.addEventListener('mouseleave', function () {
        hide_dropdown_menu();
    });

    // Cancel any existing timeout when hovering over the drop-down list.
    dropdown_menu.addEventListener('mouseenter', function () {
        clearTimeout(timeout);
    });

    // Hide the drop-down menu after a short delay.
    dropdown_menu.addEventListener('mouseleave', function () {
        hide_dropdown_menu();
    });



    // ----------------- MOBILE MENU FUNCTIONALITY ----------------- //
    // Open the menu on hamburger icon click.
    document.getElementById('mobile-open').addEventListener('click', open_mobile_menu);
    function open_mobile_menu() {
        // Hide the mobile menu icon. Display the close menu icon. Display the dropdown menu.
        mobile_menu_icon.style.display = 'none';
        mobile_menu_closed.style.display = 'block';
        mobile_menu_dropdown.style.display = 'block';
    }

    // Close the menu on close icon click.
    document.getElementById('mobile-closed').addEventListener('click', close_mobile_menu);
    function close_mobile_menu() {
        // Hide the closed menu icon. Display the open menu icon. Hide the dropdown menu.
        mobile_menu_icon.style.display = 'block';
        mobile_menu_closed.style.display = 'none';
        mobile_menu_dropdown.style.display = 'none';
    }

    // Add event listener for a change in screensize for the mobile menu.
    window.addEventListener('resize', function () {
        // Reset mobile menu when screen size changes beyond mobile breakpoint
        if (window.innerWidth > 1024) {
            reset_mobile_menu('desktop');
        }
        if (window.innerWidth <= 1024) {
            reset_mobile_menu('mobile');
        }
    });

    // Function to reset the mobile menu when it changes between sizes while displayed.
    function reset_mobile_menu(type) {
        // Reset the menu depending on the screensize growing or shrinking.
        if (type === 'desktop') {
            mobile_menu_icon.style.display = 'none';
            mobile_menu_closed.style.display = 'none';
            mobile_menu_dropdown.style.display = 'none';
        }
        else {
            mobile_menu_icon.style.display = 'block';
            mobile_menu_closed.style.display = 'none';
            mobile_menu_dropdown.style.display = 'none';
        }
    }



    // ----------------- MODAL FUNCTIONALITY ----------------- //
    // Set the functionality to close the modal when the X is clicked.
    document.getElementById('modal-close').addEventListener('click', close_modal);
    function close_modal() {

        // Reset the modal attibutes and hide the container.
        modal_container.style.display = 'none';
        modal_content.setAttribute('src', '');
        modal_content.setAttribute('alt', '');
        modal_caption.textContent = '';

        // If the page is set to 'home', refresh the page content to update the recently viewed list.
        let page_type = modal_content.getAttribute('page');
        if (page_type === 'home') {
            modal_content.setAttribute('page', '');
            let event = new Event('click');
            populate_homepage(event);
        }

        // Reset the page attribute.
        modal_content.setAttribute('page', '');
    }

    // Set the functionality to display and populate the image modal when clicked.
    function destination_image_click(element, page) {
        element.addEventListener('click', function (event) {

            // Prevent the link from opening normally.
            event.preventDefault();

            // Get the required information to populate the modal.
            let image_title = element.getAttribute('alt');
            let url = element.getAttribute('full-size');
            modal_container.style.display = 'block';
            modal_content.setAttribute('src', url);
            modal_content.setAttribute('alt', image_title);
            modal_content.setAttribute('page', page);
            modal_caption.textContent = image_title;

            // Adjust the recently viewed array accordingly.
            adjust_recently_viewed(element);
        });
    }



    // ----------------- RECENTLY VIEWED FUNCTIONALITY ----------------- //
    // Set the functionality to adjust the recently viewed array.
    function adjust_recently_viewed(element) {

        // Get the information required to populate the recently viewed array.
        let image_id = element.getAttribute('image-id');
        let image_title = element.getAttribute('alt');
        let large_square = element.getAttribute('large-square');
        let url = element.getAttribute('full-size');

        // Set each image as a new object.
        let image_data = {
            id: image_id,
            title: image_title,
            large_square: large_square,
            full_size: url
        };

        // Search the recently viewed array by id for the image data object and return it's index or -1.
        let shift_index = recently_viewed.findIndex(item => item.id === image_data.id);

        // If the id is in the recently viewed array, remove it from the array then re-add it to the front.  
        if (shift_index !== -1) {
            recently_viewed.splice(shift_index, 1);
            recently_viewed.unshift(image_data);
        }
        // If the id is not in the recently viewed array, add it to the front.
        else {
            recently_viewed.unshift(image_data);
        }

        // If the array is longer that the recently viewed number, remove all of the elements after the last index.
        let length = recently_viewed.length;
        if (length > recently_viewed_count) {
            recently_viewed.splice(recently_viewed_count);
        }
    }



    // ----------------- CONTENT POPULATION FUNCTIONALITY ----------------- //
    // DESTINATION PAGE CONTENT
    // Define an event listener function that calls populate_destination for the index of the destination when clicked.
    function destination_link_click(element, index) {
        element.addEventListener('click', function (event) {
            // Prevent the link from opening normally.
            event.preventDefault();
            populate_destination(index);
        });
    }

    function destination_link_click_mobile(element, index) {
        element.addEventListener('click', function (event) {
            // Prevent the link from opening normally.
            event.preventDefault();
            // Hide the mobile menu.
            mobile_menu_icon.style.display = 'block';
            mobile_menu_closed.style.display = 'none';
            mobile_menu_dropdown.style.display = 'none';
            populate_destination(index);
        });
    }

    // Set the functionality to display the content of a destination when it's links are clicked.
    function populate_destination(destination_index) {

        // Hide the main homepage content.
        homepage_banner.style.display = 'none';
        homepage_content.style.display = 'none';
        destination_section.style.display = 'none';
        recently_viewed_section.style.display = 'none';

        // Reset and display the content for the destination.
        destination_banner.innerHTML = '';
        destination_content.innerHTML = '';
        destination_attractions_title.innerHTML = '';
        attractions_list.innerHTML = '';
        destination_gallery_section.innerHTML = '';
        recently_viewed_content.innerHTML = '';
        destination_banner.style.display = 'block';
        destination_content.style.display = 'block';
        destination_gallery.style.display = 'block';
        destination_attractions_section.style.display = 'block';

        // Get the information from the database required to populate the destination page.
        fetch(database)
            .then(response => response.json())
            .then(data => {

                // Set the destination content variables.
                let image_id = data.destinations[destination_index].main_image;
                let destination_name = data.destinations[destination_index].name;
                let destination_text_content = data.destinations[destination_index].long;
                let destination_lattitude = data.destinations[destination_index].lattitude;
                let destination_longitude = data.destinations[destination_index].longitude;
                let search_term = destination_name.replace(/ /g, '+');

                // Create the banner image for the destination. Populate it with all information required for further functionality.
                get_main_image(image_id, 'large').then(url => {
                    let banner_image_div = document.createElement('div');
                    let banner_image = document.createElement('img');
                    banner_image.setAttribute('full-size', url);

                    // Get the url for the large square image.
                    get_main_image(image_id, 'lsquare').then(url_2 => {
                        banner_image.setAttribute('large-square', url_2);
                        banner_image.setAttribute('image-id', image_id);
                        banner_image.setAttribute('src', url);
                        banner_image.setAttribute('alt', destination_name);

                        // Append the image to the banner div.
                        banner_image_div.appendChild(banner_image);

                        // Add an event listener to the image to display in the modal.
                        destination_image_click(banner_image, 'destination');

                        // Append the image to the banner.
                        destination_banner.appendChild(banner_image_div);

                    }).catch(error => {
                        console.error('Failed to get large square image URL: ', error);
                    });
                }).catch(error => {
                    console.error('Failed to get main image URL: ', error);
                });

                // Create the heading section for the destination.
                let destination_header_div = document.createElement('div');
                let destination_header_h2 = document.createElement('h2');
                destination_header_h2.textContent = destination_name;
                destination_header_div.appendChild(destination_header_h2);

                // Create the textual content for the destination.
                let destination_content_div = document.createElement('div');
                let destination_content_p = document.createElement('p');
                destination_content_p.innerHTML = destination_text_content;
                destination_content_div.appendChild(destination_content_p);

                // Append the Google API things to do in destination.
                let destination_attraction_h4 = document.createElement('h4');
                destination_attraction_h4.textContent = 'Things To Do In ' + destination_name;
                destination_attractions_title.appendChild(destination_attraction_h4);

                // Function to initialize and display the list of attractions.
                function initiate_list() {
                    // Set the destination coordinates from the database.
                    var destination_centre = { lat: parseFloat(destination_lattitude), lng: parseFloat(destination_longitude) };

                    // Initialize the Places service
                    var service = new google.maps.places.PlacesService(document.createElement('div'));

                    // Define the text search request
                    var request = {
                        query: 'Things to do in' + destination_name,
                        location: destination_centre,
                        radius: 10000
                    };

                    // Perform the text based search.
                    service.textSearch(request, function (results, status) {
                        if (status === google.maps.places.PlacesServiceStatus.OK) {
                            // Sort the attractions by rating.
                            results.sort(function (a, b) {
                                return b.rating - a.rating;
                            });
                            // Display the attractions list
                            display_attractions_list(results);
                        } else {
                            console.error('Places service failed: ', status);
                        }
                    });
                }

                // Function to display attractions list.
                function display_attractions_list(attractions) {
                    attractions.forEach(function (attraction) {
                        // Create the div for the attraction listing.
                        let attraction_listing = document.createElement('div');
                        attraction_listing.classList.add('attractions-listing');
                        // Create the heading element.
                        let attraction_list_heading = document.createElement('h5');
                        attraction_list_heading.innerHTML = '<strong>' + attraction.name + '</strong>';
                        // Create the textual content.
                        let attraction_list_address = document.createElement('p');
                        attraction_list_address.innerHTML = '<strong>Address: </strong>' + attraction.formatted_address;
                        let attraction_list_rating = document.createElement('p');
                        attraction_list_rating.innerHTML = '<strong>Rating: </strong>' + attraction.rating;
                        // Combine the elements together.
                        attraction_listing.appendChild(attraction_list_heading);
                        attraction_listing.appendChild(attraction_list_address);
                        attraction_listing.appendChild(attraction_list_rating);
                        attractions_list.appendChild(attraction_listing);
                    });
                }

                // Call the initiate_list function to display the list of attractions
                initiate_list();

                // Append the content to the destination content section.
                destination_content.appendChild(destination_header_div);
                destination_content.appendChild(destination_content_div);

                // Set the flickr api request string. I am requesting extra images due to a weird error with the Sunshine Coast returning 1 less than requested. 
                let image_search_request = `https://www.flickr.com/services/rest/?method=flickr.photos.search&${FLICKR_API_KEY}&text=${search_term}&sort=relevance&accuracy=11&content_types=0&media=photos&per_page=${thumbnail_count + error_margin}&format=json&nojsoncallback=1`;

                // Process the search request string.
                process_search_request(image_search_request);

            })
            .catch(error => {
                console.log('Destination Display Error: ', error);
            });
    }

    
    // HOMEPAGE CONTENT
    // Define an event listener function that calls populate_homepage when the desktop homepage links are clicked.
    document.querySelectorAll('.homepage-link').forEach(function (element) {
        element.addEventListener('click', populate_homepage);
    });

    // Define an event listener function that calls populate_homepage when the mobile homepage links are clicked.
    document.querySelectorAll('.mobile-homepage-link').forEach(function (element) {
        element.addEventListener('click', function (event) {
            // Hide the mobile menu.
            mobile_menu_icon.style.display = 'block';
            mobile_menu_closed.style.display = 'none';
            mobile_menu_dropdown.style.display = 'none';
            // Populate the homepage.
            populate_homepage(event);
        });
    });

    // Define the function to be called when the homepage link is clicked.
    function populate_homepage(event) {

        // Prevent the link from opening normally.
        event.preventDefault();

        // Display the main homepage content.
        homepage_banner.style.display = 'block';
        homepage_content.style.display = 'block';
        destination_section.style.display = 'block';

        // Reset and hide the content for the destination.
        destination_banner.innerHTML = '';
        destination_content.innerHTML = '';
        destination_gallery_section.innerHTML = '';
        recently_viewed_content.innerHTML = '';
        destination_attractions_title.innerHTML = '';
        attractions_list.innerHTML = '';
        destination_banner.style.display = 'none';
        destination_content.style.display = 'none';
        destination_gallery.style.display = 'none';
        destination_attractions_section.style.display = 'none';

        // Display the recently viewed list if there are images in the list.
        let recently_viewed_length = recently_viewed.length;
        if (recently_viewed_length > 0) {
            recently_viewed.forEach(image => {

                // Create the recently viewed image div.
                let recent_viewed_div = document.createElement('div');
                recent_viewed_div.classList.add('recently-viewed-image');

                // Create the image element.
                let recent_viewed_image = document.createElement('img');
                recent_viewed_image.setAttribute('full-size', image.full_size);
                recent_viewed_image.setAttribute('large-square', image.large_square);
                recent_viewed_image.setAttribute('image-id', image.id);
                recent_viewed_image.setAttribute('src', image.large_square);
                recent_viewed_image.setAttribute('alt', image.title);

                // Append image and caption to the empty div
                recent_viewed_div.appendChild(recent_viewed_image);

                // Add an event listener to the image to display in the modal.
                destination_image_click(recent_viewed_image, 'home');

                // Append the div to the photos container
                recently_viewed_content.appendChild(recent_viewed_div);

            });
            recently_viewed_section.style.display = 'block';
        }
    }



    // ----------------- GENERAL FUNCTIONS ----------------- //
    // Define the function to pull the main image from Flickr, returning a Promise. If size = small we want small, size = lsquare for large sqaure, else large we want large.
    function get_main_image(id, size) {
        return new Promise((resolve, reject) => {

            const search_request = `https://www.flickr.com/services/rest/?method=flickr.photos.getSizes&${FLICKR_API_KEY}&photo_id=${id}&format=json&nojsoncallback=1`;

            // Process the data fetched from the sizes request for each image.
            fetch(search_request)
                .then(response => response.json())
                .then(sizes_data => {
                    const sizes_array = sizes_data.sizes.size;
                    const array_length = sizes_array.length;
                    // If size = small, we want the small image.
                    if (size === 'small') {
                        let small_index = get_small_index(sizes_array, array_length);
                        const url_small = sizes_data.sizes.size[small_index].source;
                        resolve(url_small);
                    }
                    // If size = lsquare, we want the large square.
                    else if (size === 'lsquare') {
                        let lsquare_index = get_large_square_index(sizes_array, array_length);
                        const url_lsquare = sizes_data.sizes.size[lsquare_index].source;
                        resolve(url_lsquare);
                    }
                    // Else, we want the large image.
                    else {
                        const url = sizes_data.sizes.size[array_length - 1].source;
                        resolve(url);
                    }
                })
                .catch(error => {
                    console.log('Error Fetching Main Image: ', error);
                    reject(error);
                });
        });
    }


    // Define the function to process the data fetched from the search request.
    function process_search_request(request) {
        fetch(request)
            .then(response => response.json())
            .then(data => {

                // Declare an array to store all image data.
                let images = [];
        
                /*  I was getting an incorrect return for Sunshine Coast, always returning 1 less that what was requested. 
                    So, I set the request URL to ask for X more than required, then trim the last elements if it returned correctly.
                    This allowed for the Sunshine Coast to return the correct number of image ids */
                while (data.photos.photo.length > thumbnail_count) {
                    data.photos.photo.pop();
                }
    
                // Loop through each image in the array and add the fetch requests to the array for the promise all function.
                let sizes_requests = [];
                data.photos.photo.forEach(photo => {
                    // Declare the API sizes request URL that will be used.
                    sizes_requests.push(`https://www.flickr.com/services/rest/?method=flickr.photos.getSizes&${FLICKR_API_KEY}&format=json&nojsoncallback=1&photo_id=${photo.id}`);
                });

                // Process the sizes requests array with promise all.
                let fetch_promises = sizes_requests.map(url => fetch(url));
                Promise.all(fetch_promises)
                    .then(responses => Promise.all(responses.map(response => response.json())))
                    .then(sizes_data_array => {
                        sizes_data_array.forEach((sizes_data, index) => {

                            // Get the array length and other required data to use later.
                            let length = sizes_data.sizes.size.length;
                            let search_array = sizes_data.sizes.size;
                            let thumbnail_index = get_small_index(search_array, length);
                            let large_square = get_large_square_index(search_array, length);
                            let large_index = get_large_index(search_array, length);
                            let thumbnail_url = sizes_data.sizes.size[thumbnail_index].source;
                            let large_square_url = sizes_data.sizes.size[large_square].source;
                            let fullsize_url = sizes_data.sizes.size[large_index].source;

                            // Create an object for the required information and add to the images array.
                            let image_data = {
                                id: data.photos.photo[index].id,
                                thumbnail: thumbnail_url,
                                large_square: large_square_url,
                                full_size: fullsize_url,
                                title: data.photos.photo[index].title
                            };
                            images.push(image_data);

                        });

                        // Process each image once all data is fetched to create the elements for the page.
                        images.forEach(image_data => {

                            // Create HTML elements programmatically and append them to the photos container. This is more secure.
                            let image_div = document.createElement('div');
                            image_div.classList.add('destination-thumnail');
    
                            // Create the image element.
                            let image = document.createElement('img');
                            image.setAttribute('full-size', image_data.full_size);
                            image.setAttribute('large-square', image_data.large_square);
                            image.setAttribute('image-id', image_data.id);
                            image.setAttribute('src', image_data.thumbnail);
                            image.setAttribute('alt', image_data.title);
    
                            // Create the image caption
                            let image_caption = document.createElement('p');
                            image_caption.classList.add('thumbnail-caption');
                            image_caption.innerHTML = image_data.title;
    
                            // Append image and caption to the empty div
                            image_div.appendChild(image);
                            image_div.appendChild(image_caption);
    
                            // Get the date the image was taken. Then create an element and append to the image div.
                            get_image_date(image_data.id).then(date => {
                                let image_date = document.createElement('p');
                                image_date.classList.add('thumbnail-date');
                                image_date.innerHTML = '(' + date + ')';
                                image_div.appendChild(image_date);
                            }).catch(error => {
                                console.error('Error Compiling The Image Date: ', error);
                            });
    
                            // Add an event listener to the image to display in the modal.
                            destination_image_click(image, 'destination');
    
                            // Append the div to the photos container
                            destination_gallery_section.appendChild(image_div);
                        });
                    })
                    .catch(error => {
                        console.error('Error fetching image sizes:', error);
                    });
            })
            .catch(error => {
                console.log('Error Fetching Search Photos List: ', error);
            });
    }


    // This function returns the date a photo was taken.
    function get_image_date(id) {
        return new Promise((resolve, reject) => {

            const request = `https://www.flickr.com/services/rest/?method=flickr.photos.getInfo&${FLICKR_API_KEY}&photo_id=${id}&format=json&nojsoncallback=1`

            // Process the data fetched from the api request.
            fetch(request)
                .then(response => response.json())
                .then(data => {
                    let date_taken = data.photo.dates.taken
                    let year = date_taken.slice(0, 4);
                    let month = date_taken.slice(5, 7);
                    let day = date_taken.slice(8, 10);
                    const restructured_date = day + '-' + month + '-' + year;
                    resolve(restructured_date);
                })
                .catch(error => {
                    console.log('Error Fetching The Image Date: ', error);
                    reject('Error Fetching The Image Date: ', error);
                });
        });
    }


    // This function returns the index of the 'Small' image, else it returns the thumbnail image, else it returns 0.
    function get_small_index(array, length) {
        let thumbnail = 0;
        for (let i = length - 1; i >= 0; i--) {
            if (array[i].label === 'Small') {
                return i;
            }
            if (array[i].label === 'Thumbnail') {
                thumbnail = i;
            }
        }
        return thumbnail;
    }


    // This function returns the index of the 'Large Square' image, else it returns the smallest image.
    function get_large_square_index(array, length) {
        for (let i = 0; i < length; i++) {
            if (array[i].label === 'Large Square') {
                return i;
            }
        }
        return 0;
    }


    // This function returns the index of the 'Large' image, else it returns the largest image.
    function get_large_index(array, length) {
        for (let i = length - 1; i >= 0; i--) {
            if (array[i].label === 'Large') {
                return i;
            }
        }
        return length - 1;
    }

});