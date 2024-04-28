import React, { useEffect, useState } from 'react'

import { Input, Table, Tag } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom';


function App() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');


  // Parse URL parameters on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://dummyjson.com/posts");
        console.log(response);
        if (response.status == 200) {
          const jsonData = await response.json();
          setData(jsonData.posts);
        }
        else {
          alert("Error !! While Making HTTP Calll")
        }
      } catch (error) {
        alert(`Error: ${error}`);
      }
      finally {
        setLoading(false)
      }

    }
    fetchData();



    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get('page')) || 1;
    const tags = params.getAll('tags');
    const searchQuery = params.get('q') || '';

    setPagination({ ...pagination, current: page });
    setSelectedTags(tags);
    setSearchQuery(searchQuery);

  }, []);


  // Update URL when pagination, filters, or search query change
  useEffect(() => {
    const params = new URLSearchParams();

    if (pagination.current) {
      params.set('page', pagination.current);
    }

    selectedTags?.forEach((tag) => params.append('tags', tag));

    if (searchQuery) {
      params.set('q', searchQuery);
    }

    navigate(`?${params.toString()}`);
  }, [pagination, selectedTags, searchQuery]);


  const handleChange = (e) => {
    setSearchQuery(e.target.value ? e.target.value : '');
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      filterMode: 'tree',
      width: '30%',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      filterSearch: true,
      showSorterTooltip: { target: 'full-header' },
      filterMode: 'tree',
      onFilter: (value, record) => record.title.includes(value),
      width: '30%',

    },
    {
      title: 'Body',
      dataIndex: 'body',
      filterSearch: true,
      filteredValue: [searchQuery],
      onFilter: (value, record) => record.body.toLowerCase().includes(value.toLowerCase().trim()),
      width: '30%',

    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag} >
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
      filters: [
        {
          text: 'Mystery',
          value: 'mystery',
        },

        {
          text: 'English',
          value: 'english',
        },

        {
          text: 'American',
          value: 'american',
        },


        {
          text: 'French',
          value: 'french',
        },


        {
          text: 'Crime',
          value: 'crime',
        },
        {
          text: 'Classic',
          value: 'classic',
        },
      ],
      filteredValue: selectedTags,
      onFilter: (value, row) => row.tags.includes(value),
    },
  ];

  return (
    <div className='app__container'>

      <div className='table__container'>
        <Input.Search placeholder="input search text"
          value={searchQuery}
          onChange={handleChange}
        />
        <Table columns={columns} dataSource={data} pagination={{
          ...pagination,
          onChange: (page) => setPagination({ ...pagination, current: page }),
        }}
          onChange={(pagination, filter, sorter) => {
            setPagination(pagination);
            setSelectedTags(filter.tags);
          }}
          loading={loading}
        />
      </div>

    </div>
  )
}

export default App