const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'rentsoundly',
  password: 'password',
  port: 5432,
})

const getUsers = (request, response) => {
  pool.query('SELECT * FROM rental_property ORDER BY rentalhous DESC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUserById = (request, response) => {
  const id = (request.params.id)

  pool.query('SELECT originalad,id,propertyna FROM rental_property where upper(regexp_replace(originalad,\' +\',\'\')) like $1 ORDER BY rentalhous DESC limit 10', [id +"%"], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getPropertyByLandlord = (request, response) => {
  const id = (request.params.id)

  pool.query('SELECT id,originalad,originalci,originalst,originalzi,propertyco,rentalhous,landlordid,propertyna,coalesce((select count(1) from rental_prop_code_viol where rentalid=rental_property.id group by rentalid),0) as codecnt FROM rental_property where landlordid=$1 ORDER BY rentalhous DESC', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}


const getPropertyById = (request, response) => {
  const id = (request.params.id)

  pool.query('SELECT id,originalad,originalci,originalst,originalzi,propertyco,rentalhous,landlordid,propertyna,coalesce((select count(1) from rental_prop_code_viol where rentalid=rental_property.id group by rentalid),0) as codecnt  FROM rental_property where id=$1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getPropertyIssues = (request, response) => {
  const id = (request.params.id)

  pool.query('select id,to_char(opendate,\'MM-DD-YYYY\') as date,recordtype as type ,recordty_2 as cat,descriptio as desc from rental_prop_code_viol left join code_violations on code_violations.id=codeviolid where rentalid=$1 order by opendate desc;', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

//select id,opendate,recordtype,recordty_1,recordty_2,descriptio from rental_prop_code_viol left join code_violations on code_violations.id=codeviolid where rentalid=7 order by opendate desc;

const createUser = (request, response) => {
  const { name, email } = request.body

  pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added with ID: ${results.insertId}`)
  })
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

module.exports = {
  getUsers,
  getUserById,
  getPropertyById,
  getPropertyByLandlord,
  getPropertyIssues,
  createUser,
  updateUser,
  deleteUser,
}
