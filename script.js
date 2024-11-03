async function fetchAllData() {
    try {
        const response = await fetch('/all-data');
        const data = await response.json();
        console.log('Data from API:', data); // เพิ่มการแสดงข้อมูลใน console
        const resultContainer = document.getElementById('resultContainer');
        resultContainer.innerHTML = ''; // เคลียร์เนื้อหาเก่าทุกครั้งที่ค้นหาใหม่
        if (data.error) {
            resultContainer.innerHTML = `<p>Error: ${data.error}</p>`;
            return;
        }
        const tableNames = Object.keys(data);
        if (tableNames.length === 0) {
            resultContainer.innerHTML = '<p>No results found.</p>';
            return;
        }
        // สร้างตารางสำหรับแต่ละตารางในฐานข้อมูล
        tableNames.forEach(tableName => {
            const tableTitle = document.createElement('h2');
            tableTitle.textContent = tableName;
            resultContainer.appendChild(tableTitle);
            const table = document.createElement('table');
            table.border = '1';
            resultContainer.appendChild(table);
            if (data[tableName].length > 0) {
                const headerRow = document.createElement('tr');
                Object.keys(data[tableName][0]).forEach(key => {
                    const th = document.createElement('th');
                    th.textContent = key;
                    headerRow.appendChild(th);
                });
                table.appendChild(headerRow);
                data[tableName].forEach(row => {
                    const tr = document.createElement('tr');
                    Object.values(row).forEach(value => {
                        const td = document.createElement('td');
                        td.textContent = value;
                        tr.appendChild(td);
                    });
                    table.appendChild(tr);
                });
            } else {
                const noDataRow = document.createElement('tr');
                const noDataCell = document.createElement('td');
                noDataCell.colSpan = Object.keys(data[tableName][0] || {}).length || 1;
                noDataCell.textContent = 'No data available';
                noDataRow.appendChild(noDataCell);
                table.appendChild(noDataRow);
            }
        });
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('resultContainer').innerHTML = '<p>Error loading data</p>';
    }
}
fetchAllData();