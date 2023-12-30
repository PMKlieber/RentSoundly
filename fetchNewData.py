import psycopg2
import json
import curl

conn=psycopg2.connect('')
rentPropAPIUrl="https://data.seattle.gov/resource/j2xh-c7vt.json?"

psqlDatabase="rentsoundly"
psqlUsername="postgres"
conn=psycopg2.connect(f"dbname={psqlDatabase} user={psqlUsername}")
cur=conn.cursor()
cur.execute("select max(registrati) from rental_property")
maxPropPerm=cur.fetchone()[0]

url=rentPropAPIUrl +"$where=permitnum>'{}'".format(maxPropPerm)
res=curl.Curl(url).get()
resJson=json.loads(res)
for rJson in resJson:
    insData=(rJson['permitnum'], rJson['permittypemapped'], rJson['permittypedesc'], rJson['rentalhousingunits'], rJson['registereddate'], rJson['expiresdate'], rJson['statuscurrent'], rJson['originaladdress1'], rJson['originalcity'], rJson['originalstate'], rJson['originalzip'], rJson['propertycontactname'], rJson['link'], rJson['latitude'], rJson['longitude'], rJson['location1'])
    cur.execute("INSERT INTO rental_property (registrati, registered, register_1, rentalhous, propertyna, register_2, expiresdat, " +
    "statuscurr, originalad, originalci, originalst, originalzi, propertyco, link, latitude, longitude, location1)" +
    " VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
    insData)

