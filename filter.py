#=============================================================================
# filter.py
#
# Script to filter Yelp dataset for specified city and category.
#
# Author: Orlando Moreno
# Date: June 25, 2020
#=============================================================================*/

import json
  
city = 'Tempe'
category = 'Restaurants'
businesses = []

# Filter out the businesses 
with open('yelp_academic_dataset_business.json') as json_in:
    with open('tempe_restaurants.json', 'w') as json_out:
        for i,line in enumerate(json_in):
            data = json.loads(line)
            if data['city'] == city:
                try:
                    if category in data['categories']:
                        businesses.append(data['business_id'])
                        json.dump(data, json_out)
                        json_out.write('\n')
                except:
                    # Some businesses have null categories
                    continue

# Filter out the reviews for businesses determined above
with open('yelp_academic_dataset_review.json') as json_in:
    with open('tempe_restaurants_reviews.json', 'w') as json_out:
        for i,line in enumerate(json_in):
            data = json.loads(line)
            if data['business_id'] in businesses:
                json.dump(data, json_out)
                json_out.write('\n')

# Filter out the tips for businesses determined above
with open('yelp_academic_dataset_tip.json') as json_in:
    with open('tempe_restaurants_tip.json', 'w') as json_out:
        for i,line in enumerate(json_in):
            data = json.loads(line)
            if data['business_id'] in businesses:
                json.dump(data, json_out)
                json_out.write('\n')
