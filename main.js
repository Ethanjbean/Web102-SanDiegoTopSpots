$(document).ready(function () {

    const map = L.map('map').setView([32.9, -117.15], 10);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    $.getJSON("data.json", function (table_data) {
        populateTable(table_data);
        map.invalidateSize();
    }).fail(function (error) {
        console.error('Error loading data', error);
    });

    function populateTable(table_data) {
        const tableBody = $('#populate-table');

        table_data.forEach(function (spot, index) {
            const marker = L.marker(spot.location).addTo(map);

            marker.bindPopup(`
                <strong>${spot.name}</strong><br>
                ${spot.description}
            `);

            const row = `
                <tr class="spot-row" data-index="${index}" style="cursor: pointer;">
                    <td>${spot.name}</td>
                    <td>${spot.description}</td>
                    <td><a href="https://www.google.com/maps?q=${spot.location}" class="btn btn-primary" onclick="event.stopPropagation();"> View on Map </a></td>
                </tr>
            `;
            tableBody.append(row);

            // stash the marker on the row itself so the click handler can find it
            tableBody.find('tr').last().data('marker', marker).data('location', spot.location);
        });
    }

    // clicking a row flies the map to that spot and opens its popup
    $('#populate-table').on('click', '.spot-row', function () {
        const marker = $(this).data('marker');
        const location = $(this).data('location');

        map.flyTo(location, 15);
        marker.openPopup();
    });
});

    // write your code her