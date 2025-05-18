
import { useState, useEffect } from "react"
import {
  Search,
  MapPin,
  ArrowUpDown,
} from "lucide-react"

const sampleUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    location: "New York, USA",
    status: "active",
    created: "2023-01-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    location: "Los Angeles, USA",
    status: "inactive",
    created: "2023-02-20",
  },
  {
    id: 3,
    name: "Robert Johnson",
    email: "robert@example.com",
    location: "Chicago, USA",
    status: "active",
    created: "2023-03-10",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily@example.com",
    location: "Miami, USA",
    status: "pending",
    created: "2023-04-05",
  },
  {
    id: 5,
    name: "Michael Wilson",
    email: "michael@example.com",
    location: "Seattle, USA",
    status: "active",
    created: "2023-05-12",
  },
  {
    id: 6,
    name: "Sarah Brown",
    email: "sarah@example.com",
    location: "Boston, USA",
    status: "active",
    created: "2023-06-18",
  },
  {
    id: 7,
    name: "David Miller",
    email: "david@example.com",
    location: "Denver, USA",
    status: "inactive",
    created: "2023-07-22",
  },
  {
    id: 8,
    name: "Jennifer Taylor",
    email: "jennifer@example.com",
    location: "Phoenix, USA",
    status: "pending",
    created: "2023-08-30",
  },
  {
    id: 9,
    name: "James Anderson",
    email: "james@example.com",
    location: "Dallas, USA",
    status: "active",
    created: "2023-09-14",
  },
  {
    id: 10,
    name: "Lisa Thomas",
    email: "lisa@example.com",
    location: "Atlanta, USA",
    status: "inactive",
    created: "2023-10-25",
  },
]

export default function UserDetails() {
  const [users, setUsers] = useState(sampleUsers)
  const [nameFilter, setNameFilter] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [sortConfig, setSortConfig] = useState(null)

  useEffect(() => {
    let filteredUsers = [...sampleUsers]

    if (nameFilter) {
      filteredUsers = filteredUsers.filter((user) => 
        user.name.toLowerCase().includes(nameFilter.toLowerCase())
      )
    }

    if (locationFilter) {
      filteredUsers = filteredUsers.filter((user) => 
        user.location.toLowerCase().includes(locationFilter.toLowerCase())
      )
    }

    if (sortConfig) {
      filteredUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
    }

    setUsers(filteredUsers)
  }, [nameFilter, locationFilter, sortConfig])

  const requestSort = (key) => {
    let direction = "ascending"
    if (sortConfig?.key === key && sortConfig?.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>
      case "inactive":
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Inactive</span>
      case "pending":
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span>
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Filter Users</h2>
        </div>
        <div className="p-6">
          <div className="grid gap-4 md:grid-cols-2 sm:grid-cols-1">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter by location..."
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => requestSort("name")}>
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => requestSort("location")}>
                    Location
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(user.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}