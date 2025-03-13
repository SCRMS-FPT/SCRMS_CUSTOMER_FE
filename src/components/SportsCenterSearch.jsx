import React from 'react';
import { Input } from 'antd';

const SportsCenterSearch = ({ searchText, handleSearch }) => {
    return (
        <div style={{
            backgroundImage: 'url(/src/assets/HLV/sp.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '50px', // Increase padding
            marginBottom: '20px',
            height: '650px', // Set a fixed height
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white', // Ensure text is visible on the background
            textAlign: 'center'
        }}>
            <h1 style={{
                marginBottom: '20px',
                fontSize: '48px', // Increase font size
                fontWeight: 'bold', // Make text bold
                color: 'red' // Set text color to black
            }}>
                Sport Center
            </h1>
            <Input.Search
                placeholder="Search sports centers"
                value={searchText}
                onChange={handleSearch}
                style={{ width: '50%' }} // Adjust width as needed
            />
        </div>
    );
};

export default SportsCenterSearch;