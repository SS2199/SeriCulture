import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient

url = "https://en.krashimitra.com/silk-market-price-karnataka/"

# MongoDB connection details for local instance
mongo_uri = "mongodb://localhost:27017/"
database_name = "ProductsDB"
collection_name = "Cocoon"

# Connect to MongoDB
client = MongoClient(mongo_uri)
db = client[database_name]
collection = db[collection_name]

# Send a GET request to the URL
response = requests.get(url)

# Check if the request was successful (status code 200)
if response.status_code == 200:
    # Parse the HTML content using BeautifulSoup
    soup = BeautifulSoup(response.text, 'lxml')

    # Find the table containing silk prices
    table = soup.find('table')

    # Check if the table is found
    if table:
        # Map old header names to new header names
        header_mapping = {
            'Breed': 'Breed',
            'City': 'City',
            'Location': 'Location',
            'Date': 'Date',
            'ಕನಿಷ್ಠ ಬೆಲೆ': 'Min_Price',
            'ಗರಿಷ್ಠ ಬೆಲೆ': 'Max_Price',
            'ಸರಾಸರಿ ಬೆಲೆ': 'Avg_Price',
            'ಪ್ರಮಾಣ (ಎಂ.ಟಿ.)': 'Quantity'
        }

        # Extract and store the data in MongoDB
        current_breed = ''
        for row in table.find_all('tr')[1:]:
            data = {header_mapping.get(th.text.strip(), th.text.strip()): td.text.strip() for th, td in zip(table.find_all('th'), row.find_all('td'))}

            # Check if Breed field is empty, and fill it with the current breed name
            if not data['Breed']:
                data['Breed'] = current_breed
            else:
                current_breed = data['Breed']  # Update current breed if not empty

            # Insert the data into MongoDB
            collection.insert_one(data)
    else:
        print("Table not found on the webpage.")
else:
    print(f"Failed to fetch the webpage. Status code: {response.status_code}")

# Close the MongoDB connection
client.close()
