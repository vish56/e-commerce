import React from 'react'
import { Pagination } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'

const Paginate = ({ pages, page }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const searchParams = new URLSearchParams(location.search)
  const keyword = searchParams.get('keyword') || ''
  const sort = searchParams.get('sort') || ''

  if (pages <= 1) return null

  const handlePageChange = (newPage) => {
    let query = `?page=${newPage}`

    if (keyword) query += `&keyword=${keyword}`
    if (sort) query += `&sort=${sort}`

    navigate(query)
  }

  return (
    <Pagination className="justify-content-center mt-4">
      {[...Array(pages).keys()].map((x) => (
        <Pagination.Item
          key={x + 1}
          active={x + 1 === Number(page)}
          onClick={() => handlePageChange(x + 1)}
        >
          {x + 1}
        </Pagination.Item>
      ))}
    </Pagination>
  )
}

export default Paginate
