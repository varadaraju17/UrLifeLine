import React, { useState, useRef, useEffect } from 'react';

const DropdownSelect = ({ 
  label, 
  options, 
  value, 
  onChange, 
  placeholder = "Select...",
  searchable = true,
  className = "",
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  
  // Filter options based on search
  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder;
  
  return (
    <div ref={dropdownRef} className={`w-full ${className}`}>
      {label && (
        <label className="block text-gray-300 text-sm font-medium mb-2">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      
      {/* Input/Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-left bg-white/5 border-2 border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-white/40 transition-all flex items-center justify-between"
      >
        <span className={value ? "text-white" : "text-gray-400"}>
          {selectedLabel}
        </span>
        <span className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>
      
      {/* Dropdown List - FIXED VISIBILITY */}
      {isOpen && (
        <div className="relative">
          <div className="absolute top-1 left-0 right-0 z-[9999] bg-white/10 backdrop-blur-md border-2 border-white/20 border-t-0 rounded-b-lg shadow-2xl mt-0">
            
            {/* Search Input */}
            {searchable && (
              <div className="p-2 border-b border-white/10 sticky top-0 bg-white/5 z-[10000] rounded-b-lg">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-white/20 rounded-md bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm transition-all"
                  autoFocus
                />
              </div>
            )}
            
            {/* Options List */}
            <ul className="max-h-64 overflow-y-auto py-2">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <li key={option.value}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                        setSearchTerm("");
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-white/20 transition-colors duration-150 text-white ${
                        value === option.value
                          ? "bg-blue-500/30 border-l-4 border-blue-400 font-semibold"
                          : "text-gray-200"
                      }`}
                    >
                      {option.label}
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-4 py-3 text-gray-400 text-center">
                  No options found
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownSelect;
