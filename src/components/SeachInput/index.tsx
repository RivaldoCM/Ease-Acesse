
import { SearchButton } from './style';
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export function SearchInput({ value, onChange, placeholder, onSubmit}: any){
    return(
        <SearchButton>
            <div className="search-container">
                <form onSubmit={onSubmit}>
                    <div className="search-box">
                        <input
                            className="search-input" 
                            type="text" 
                            placeholder={placeholder}
                            onChange={onChange}
                            value={value}
                        />
                        <IconButton type="submit" className="search-button" size='small'>
                            <SearchIcon />
                        </IconButton>
                    </div>
                </form>
            </div>
        </SearchButton>
    )
}