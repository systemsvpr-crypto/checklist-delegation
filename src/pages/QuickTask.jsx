"use client"
import { useEffect, useState, useCallback,useRef  } from "react";
import { format } from 'date-fns';
import { Search, ChevronDown, Filter } from "lucide-react";
import AdminLayout from "../components/layout/AdminLayout";
import DelegationPage from "./delegation-data";

export default function QuickTask() {
  const [tasks, setTasks] = useState([]);
  const [delegationTasks, setDelegationTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [delegationLoading, setDelegationLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [activeTab, setActiveTab] = useState('checklist');
  const [nameFilter, setNameFilter] = useState('');
  const [freqFilter, setFreqFilter] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState({
    name: false,
    frequency: false
  });
  const [selectedRows, setSelectedRows] = useState(new Set());
const [editingRows, setEditingRows] = useState(new Set());
const [editedData, setEditedData] = useState({});
const [submitting, setSubmitting] = useState(false);
const dropdownRef = useRef(null);


useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen({ name: false, frequency: false });
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);

// Dropdown toggle functions



const formatTimestampForSheet = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};



const generateTaskId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `TASK${timestamp}${random}`;
};

const handleRowSelection = (taskId) => {
  const newSelected = new Set(selectedRows);
  const newEditing = new Set(editingRows);

  if (newSelected.has(taskId)) {
    newSelected.delete(taskId);
    newEditing.delete(taskId);
    // Remove from edited data
    setEditedData(prev => {
      const newData = { ...prev };
      delete newData[taskId];
      return newData;
    });
  } else {
    newSelected.add(taskId);
    newEditing.add(taskId);
    // Initialize edited data with current task data
    const task = filteredChecklistTasks.find(t => t._id === taskId);
    setEditedData(prev => ({ ...prev, [taskId]: { ...task } }));
  }

  setSelectedRows(newSelected);
  setEditingRows(newEditing);
};

const handleSelectAll = () => {
  if (selectedRows.size === filteredChecklistTasks.length) {
    // Deselect all
    setSelectedRows(new Set());
    setEditingRows(new Set());
    setEditedData({});
  } else {
    // Select all
    const allIds = new Set(filteredChecklistTasks.map(task => task._id));
    setSelectedRows(allIds);
    setEditingRows(allIds);
    // Initialize edited data for all tasks
    const newEditedData = {};
    filteredChecklistTasks.forEach(task => {
      newEditedData[task._id] = { ...task };
    });
    setEditedData(newEditedData);
  }
};

const handleInputChange = (taskId, field, value) => {
  setEditedData(prev => ({
    ...prev,
    [taskId]: { ...prev[taskId], [field]: value }
  }));
};

const formatDateForSheet = (dateString) => {
  if (!dateString) return '';
  
  // If already in sheet format "12/11/2025 21:00:00", return exactly as-is
  if (typeof dateString === 'string' && dateString.match(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/)) {
    return dateString;
  }
  
  // Handle Google Sheets Date format: Date(2025,11,12,9,0,0)
  if (typeof dateString === 'string' && dateString.startsWith('Date(')) {
    try {
      const match = dateString.match(/Date\((\d+),(\d+),(\d+),(\d+),(\d+),(\d+)\)/);
      if (match) {
        const year = parseInt(match[1], 10);
        const month = parseInt(match[2], 10); // 0-based (0=Jan, 11=Dec)
        const day = parseInt(match[3], 10);
        const hour = parseInt(match[4], 10);
        const minute = parseInt(match[5], 10);
        const second = parseInt(match[6], 10);
        
        // Format to DD/MM/YYYY HH:MM:SS
        const formattedDay = String(day).padStart(2, '0');
        const formattedMonth = String(month + 1).padStart(2, '0'); // Convert to 1-based
        const formattedYear = year;
        const formattedHour = String(hour).padStart(2, '0');
        const formattedMinute = String(minute).padStart(2, '0');
        const formattedSecond = String(second).padStart(2, '0');
        
        return `${formattedDay}/${formattedMonth}/${formattedYear} ${formattedHour}:${formattedMinute}:${formattedSecond}`;
      }
    } catch (e) {
      // Continue to other parsing methods
    }
  }
  
  // Handle Date object or ISO string
  try {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }
  } catch (e) {
    // Return original value if can't parse
  }
  
  return dateString; // Return whatever was in the input field
};




const submitSelectedTasks = async () => {
  try {
    setSubmitting(true);
    
    const userAppScriptUrl = "https://script.google.com/macros/s/AKfycbyPJT9aAXFq9A3Z0S3PCZTd8OhT5jdDXYjhkftgLVlWKadfH5ACcWx8AODGesaA4yeuLQ/exec";
    const userSheetId = CONFIG.SHEET_ID;
    
    if (!userAppScriptUrl || !userSheetId) {
      throw new Error('User configuration missing. Please log in again.');
    }

    // Fetch last Task ID
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${userSheetId}/gviz/tq?tqx=out:json&sheet=${CONFIG.CHECKLIST_SHEET}`;
    const sheetResponse = await fetch(sheetUrl);
    const sheetText = await sheetResponse.text();
    const jsonStart = sheetText.indexOf('{');
    const jsonEnd = sheetText.lastIndexOf('}') + 1;
    const jsonData = sheetText.substring(jsonStart, jsonEnd);
    const sheetData = JSON.parse(jsonData);

    let lastTaskId = 0;
    if (sheetData?.table?.rows) {
      for (let i = 1; i < sheetData.table.rows.length; i++) {
        const taskIdValue = sheetData.table.rows[i].c[1]?.v;
        if (taskIdValue) {
          const taskIdNum = parseInt(taskIdValue);
          if (!isNaN(taskIdNum)) lastTaskId = Math.max(lastTaskId, taskIdNum);
        }
      }
    }

    // Generate tasks with sequential Task IDs
    const tasksToSubmit = Array.from(selectedRows).map((taskId, index) => {
      const editedTask = editedData[taskId];
      const newTaskId = lastTaskId + index + 1;
      const currentTimestamp = formatTimestampForSheet();
      
      // Log the original and formatted date for debugging
      console.log("Date processing:", {
        original: editedTask['End Date'],
        formatted: formatDateForSheet(editedTask['End Date'])
      });
      
      return {
        timestamp: currentTimestamp,
        taskId: String(newTaskId),
        department: editedTask.Department || "",
        givenBy: editedTask['Given By'] || "",
        name: editedTask.Name || "",
        description: editedTask['Task Description'] || "",
        startDate: formatDateForSheet(editedTask['End Date']), // Use the improved function
        freq: editedTask.Frequency || "",
        enableReminders: editedTask.Reminders || "",
        requireAttachment: editedTask.Attachment || ""
      };
    });

    console.log("Final tasks to submit:", tasksToSubmit);

    const submitUrl = `${userAppScriptUrl}?sheetName=${CONFIG.CHECKLIST_SHEET}&action=insert&batchInsert=true`;
    const response = await fetch(submitUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        rowData: JSON.stringify(tasksToSubmit),
        sheetName: CONFIG.CHECKLIST_SHEET,
        action: 'insert',
        batchInsert: 'true'
      })
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();

    if (!result.success) throw new Error(result.error || 'Server returned error');

    setSelectedRows(new Set());
    setEditingRows(new Set());
    setEditedData({});
    await fetchChecklistData();
    alert(`Successfully submitted ${tasksToSubmit.length} tasks!`);
  } catch (error) {
    console.error('Submission error:', error);
    alert(`Error: ${error.message}`);
  } finally {
    setSubmitting(false);
  }
};






  const CONFIG = {
    SHEET_ID: "1gNtEDmeK8hdcg1NJ-N2Em8lrrVAjCB3aSPO9Lubvq94",
    WHATSAPP_SHEET: "master", // For login credentials and user roles
    CHECKLIST_SHEET: "Unique", // For unique checklist tasks
    DELEGATION_SHEET: "Delegation", // For delegation tasks
    PAGE_CONFIG: {
      title: "Task Management",
      description: "Showing your tasks"
    }
  };

  // Auto-detect current user from login session and get role from Whatsapp sheet
  const fetchCurrentUser = useCallback(async () => {
    try {
      setUserLoading(true);
      setError(null);

      // Get user data from your login system (sessionStorage)
      const loggedInUsername = sessionStorage.getItem('username');

      // console.log("Session data found:");
      // console.log("Username from session:", loggedInUsername);

      if (!loggedInUsername) {
        throw new Error("No user logged in. Please log in to access tasks.");
      }

      // Fetch user role from Whatsapp sheet
      const whatsappSheetUrl = `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/gviz/tq?tqx=out:json&sheet=${CONFIG.WHATSAPP_SHEET}`;
      const response = await fetch(whatsappSheetUrl);
      const text = await response.text();

      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      const jsonData = text.substring(jsonStart, jsonEnd);
      const data = JSON.parse(jsonData);

      console.log("data:", data);

      if (data?.table?.rows) {
        let foundUser = null;

        // Skip header row and search for user
        data.table.rows.slice(1).forEach((row) => {
          if (row.c) {
            const doerName = row.c[3]?.v || ""; // Column C - Doer's Name
            const role = row.c[5]?.v || "user"; // Column E - Role

            console.log(doerName)
            console.log(loggedInUsername)

            // Match by username (case-insensitive)
            if (doerName.toLowerCase().trim() === loggedInUsername.toLowerCase().trim()) {
              foundUser = {
                name: doerName,
                role: role.toLowerCase().trim(),
                department: row.c[0]?.v || "", // Column A - Department
                givenBy: row.c[1]?.v || "", // Column B - Given By
                email: row.c[6]?.v || "" // Column F - ID/Email
              };
            }
          }
        });


        if (foundUser) {
          setCurrentUser(foundUser.name);
          setUserRole(foundUser.role);
          // console.log("User found in Whatsapp sheet:", foundUser);
        } else {
          throw new Error(`User "${loggedInUsername}" not found in Whatsapp sheet. Please contact administrator.`);
        }
      } else {
        throw new Error("Could not fetch user data from Whatsapp sheet");
      }
    } catch (err) {
      console.error("Error fetching user:", err);

      setError(err.message);
    } finally {
      setUserLoading(false);
    }
  }, []);
// **COMPLETE CORRECTED fetchChecklistData function** - Replace your entire fetchChecklistData function:

const fetchChecklistData = useCallback(async () => {
  if (!currentUser || userLoading) return;

  try {
    setLoading(true);

    // Fetch from Checklist sheet (Unique sheet)
    const checklistUrl = `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/gviz/tq?tqx=out:json&sheet=${CONFIG.CHECKLIST_SHEET}`;
    const response = await fetch(checklistUrl);
    const text = await response.text();

    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    const jsonData = text.substring(jsonStart, jsonEnd);
    const data = JSON.parse(jsonData);

    if (data?.table?.rows) {
      const rows = data.table.rows.slice(1); // Skip header

      // Map columns according to your specification (B-J from Checklist sheet)
      const transformedData = rows.map((row, rowIndex) => {
        // Handle End Date field - convert from Google Sheets format if needed
        let startDateValue = row.c[6]?.v || "";
        if (typeof startDateValue === 'string' && startDateValue.startsWith('Date(')) {
          startDateValue = formatDateForSheet(startDateValue);
        }
        
        const baseData = {
          _id: `checklist_${rowIndex}_${Math.random().toString(36).substring(2, 15)}`,
          _rowIndex: rowIndex + 2,
          'Task ID': row.c[1]?.v || "",
          Department: row.c[2]?.v || "",
          'Given By': row.c[3]?.v || "",
          Name: row.c[4]?.v || "",
          'Task Description': row.c[5]?.v || "",
          'End Date': startDateValue, // Use processed date
          Frequency: row.c[7]?.v || "",
          Reminders: row.c[8]?.v || "",
          Attachment: row.c[9]?.v || "",
          Task: 'Checklist'
        };
        return baseData;
      }).filter(item => {
        // Filter out rows where both Name and Task Description are empty
        return item.Name && item['Task Description'];
      });

      // Create unique tasks based on Name + Task Description combination
      const uniqueTasksMap = new Map();
      transformedData.forEach(task => {
        const key = `${task.Name?.toLowerCase().trim()}_${task['Task Description']?.toLowerCase().trim()}`;
        if (!uniqueTasksMap.has(key)) {
          uniqueTasksMap.set(key, task);
        }
      });

      const uniqueTasks = Array.from(uniqueTasksMap.values());

      // Apply role-based filtering
      let filteredData;
      if (userRole === 'admin') {
        filteredData = uniqueTasks;
      } else {
        filteredData = uniqueTasks.filter(item => {
          const itemName = (item.Name || '').toString().toLowerCase().trim();
          const currentUserLower = currentUser.toLowerCase().trim();
          return itemName === currentUserLower;
        });
      }

      setTasks(filteredData);
    } else {
      throw new Error("Invalid checklist data format");
    }
  } catch (err) {
    console.error("Checklist fetch error:", err);
    setError(err.message || "Failed to load checklist data");
  } finally {
    setLoading(false);
  }
}, [currentUser, userRole, userLoading]);

  const fetchDelegationData = useCallback(async () => {
    if (!currentUser || userLoading) return;

    try {
      setDelegationLoading(true);

      // Fetch from Delegation sheet
      const delegationUrl = `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/gviz/tq?tqx=out:json&sheet=${CONFIG.DELEGATION_SHEET}`;
      const response = await fetch(delegationUrl);
      const text = await response.text();

      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      const jsonData = text.substring(jsonStart, jsonEnd);
      const data = JSON.parse(jsonData);

      if (data?.table?.rows) {
        const rows = data.table.rows.slice(1); // Skip header
        const transformedData = rows.map((row, rowIndex) => {
          const baseData = {
            _id: `delegation_${rowIndex}_${Math.random().toString(36).substring(2, 15)}`,
            _rowIndex: rowIndex + 2,
            // Map columns from Delegation sheet (keep existing mapping)
            Timestamp: formatDate(row.c[0]?.v),
            'Task ID': row.c[1]?.v || "",
            Department: row.c[2]?.v || "",
            'Given By': row.c[3]?.v || "",
            Name: row.c[4]?.v || "",
            'Task Description': row.c[5]?.v || "",
            'Task End Date': formatDate(row.c[6]?.v),
            Freq: row.c[7]?.v || "",
            'Enable Reminders': row.c[8]?.v || "",
            'Require Attachment': row.c[9]?.v || "",
          };
          return baseData;
        });

        // console.log(`Total delegation tasks:`, transformedData.length);

        // Apply role-based filtering (unchanged from original)
        let filteredData;
        if (userRole === 'admin') {
          // Admin sees all tasks
          filteredData = transformedData;
          // console.log("Admin access: showing all delegation tasks");
        } else {
          // Regular user sees only their tasks
          filteredData = transformedData.filter(item => {
            const itemName = (item.Name || '').toString().toLowerCase().trim();
            const itemGivenBy = (item['Given By'] || '').toString().toLowerCase().trim();
            const currentUserLower = currentUser.toLowerCase().trim();

            const isAssignedToUser = itemName === currentUserLower;
            const isGivenByUser = itemGivenBy === currentUserLower;

            return isAssignedToUser || isGivenByUser;
          });
          // console.log(`User access: filtered delegation tasks for ${currentUser}:`, filteredData.length);
        }

        setDelegationTasks(filteredData);
      } else {
        throw new Error("Invalid delegation data format");
      }
    } catch (err) {
      console.error("Delegation fetch error:", err);
      setError(err.message || "Failed to load delegation data");
    } finally {
      setDelegationLoading(false);
    }
  }, [currentUser, userRole, userLoading]);

  const formatDate = (dateValue) => {
    if (!dateValue) return "";
    try {
      // already "dd/MM/yyyy HH:mm:ss"
      if (typeof dateValue === "string" &&
          dateValue.match(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/)) {
        return dateValue;
      }
  
      // Google Sheets gviz: Date(2025,10,12,21,0,0)
      if (typeof dateValue === "string" && dateValue.startsWith("Date(")) {
        const match = dateValue.match(/Date\((\d+),(\d+),(\d+),(\d+),(\d+),(\d+)\)/);
        if (match) {
          const year = parseInt(match[1], 10);
          const month = parseInt(match[2], 10);      // already 0‑based
          const day = parseInt(match[3], 10);
          const hour = parseInt(match[4], 10);
          const minute = parseInt(match[5], 10);
          const second = parseInt(match[6], 10);
          const d = new Date(year, month, day, hour, minute, second);
          const dd = String(d.getDate()).padStart(2, "0");
          const mm = String(d.getMonth() + 1).padStart(2, "0");
          const yyyy = d.getFullYear();
          const hh = String(d.getHours()).padStart(2, "0");
          const mi = String(d.getMinutes()).padStart(2, "0");
          const ss = String(d.getSeconds()).padStart(2, "0");
          return `${dd}/${mm}/${yyyy} ${hh}:${mi}:${ss}`;
        }
      }
  
      // fallback
      const d = new Date(dateValue);
      if (!isNaN(d.getTime())) {
        const dd = String(d.getDate()).padStart(2, "0");
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const yyyy = d.getFullYear();
        const hh = String(d.getHours()).padStart(2, "0");
        const mi = String(d.getMinutes()).padStart(2, "0");
        const ss = String(d.getSeconds()).padStart(2, "0");
        return `${dd}/${mm}/${yyyy} ${hh}:${mi}:${ss}`;
      }
  
      return dateValue;
    } catch {
      return dateValue;
    }
  };
  

  const requestSort = (key) => {
    if (loading) return;
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const toggleDropdown = (dropdown) => {
    setDropdownOpen(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown]
    }));
  };

  const handleNameFilterSelect = (name) => {
    setNameFilter(name);
    setDropdownOpen({ ...dropdownOpen, name: false });
  };

  const handleFrequencyFilterSelect = (freq) => {
    setFreqFilter(freq);
    setDropdownOpen({ ...dropdownOpen, frequency: false });
  };

  const clearNameFilter = () => {
    setNameFilter('');
    setDropdownOpen({ ...dropdownOpen, name: false });
  };

  const clearFrequencyFilter = () => {
    setFreqFilter('');
    setDropdownOpen({ ...dropdownOpen, frequency: false });
  };

  // Get filter options based on active tab
  const getFilterOptions = () => {
    const currentTasks = activeTab === 'checklist' ? tasks : delegationTasks;

    const names = [...new Set(currentTasks.map(task => task.Name))]
      .filter(name => name && typeof name === 'string' && name.trim() !== '');

    // For checklist, use 'Frequency' field, for delegation use 'Freq'
    const frequencies = activeTab === 'checklist'
      ? [...new Set(currentTasks.map(task => task.Frequency))]
        .filter(freq => freq && typeof freq === 'string' && freq.trim() !== '')
      : [...new Set(currentTasks.map(task => task.Freq))]
        .filter(freq => freq && typeof freq === 'string' && freq.trim() !== '');

    return { names, frequencies };
  };

  const { names: currentNames, frequencies: currentFrequencies } = getFilterOptions();

  // Reset filters when changing tabs
  useEffect(() => {
    setNameFilter('');
    setFreqFilter('');
    setDropdownOpen({ name: false, frequency: false });
  }, [activeTab]);

  const filteredChecklistTasks = tasks.filter(task => {
    const nameFilterPass = !nameFilter || task.Name === nameFilter;
    const freqFilterPass = !freqFilter || task.Frequency === freqFilter;
    const searchTermPass = Object.values(task).some(
      value => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    return nameFilterPass && freqFilterPass && searchTermPass;
  }).sort((a, b) => {
    if (!sortConfig.key) return 0;
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Auto-detect user on component mount
  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // Fetch task data when user is loaded
  useEffect(() => {
    if (currentUser && userRole && !userLoading) {
      // console.log("Fetching data for user:", currentUser, "with role:", userRole);
      fetchChecklistData();
      fetchDelegationData();
    }
  }, [fetchChecklistData, fetchDelegationData, currentUser, userRole, userLoading]);

  // Show loading while fetching user data
  if (userLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-purple-600 text-lg">Loading user session...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Show error if user not found or not logged in
  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg border border-red-200">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
              <p className="text-sm text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.href = '/login'}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="sticky top-0 z-30 bg-white pb-4 border-b border-gray-200">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-purple-700 pl-3">
              {CONFIG.PAGE_CONFIG.title}
            </h1>
            <p className="text-purple-600 text-sm pl-3">
              {currentUser && `Welcome ${currentUser}`}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
            <div className="flex border border-purple-200 rounded-md overflow-hidden self-start">
              <button
                className={`px-4 py-2 text-sm font-medium ${activeTab === 'checklist' ? 'bg-purple-600 text-white' : 'bg-white text-purple-600 hover:bg-purple-50'}`}
                onClick={() => setActiveTab('checklist')}
              >
                Unique Task
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${activeTab === 'delegation' ? 'bg-purple-600 text-white' : 'bg-white text-purple-600 hover:bg-purple-50'}`}
                onClick={() => setActiveTab('delegation')}
              >
                Delegation
              </button>
            </div>

            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={loading || delegationLoading}
              />
            </div>

            <div className="flex gap-2" ref={dropdownRef}>
  {/* Name Filter Dropdown */}
  <div className="relative">
    <button
      onClick={() => toggleDropdown('name')}
      className="flex items-center gap-2 px-3 py-2 border border-purple-200 rounded-md bg-white text-sm text-gray-700 hover:bg-gray-50"
    >
      <Filter className="h-4 w-4" />
      {nameFilter || 'Filter by Name'}
      <ChevronDown size={16} className={`transition-transform ${dropdownOpen.name ? 'rotate-180' : ''}`} />
    </button>
    {dropdownOpen.name && (
      <div className="absolute z-50 mt-1 w-56 rounded-md bg-white shadow-lg border border-gray-200 max-h-60 overflow-auto">
        <div className="py-1">
          <button
            onClick={clearNameFilter}
            className={`block w-full text-left px-4 py-2 text-sm ${!nameFilter ? 'bg-purple-100 text-purple-900' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            All Names
          </button>
          {currentNames.map(name => (
            <button
              key={name}
              onClick={() => handleNameFilterSelect(name)}
              className={`block w-full text-left px-4 py-2 text-sm ${nameFilter === name ? 'bg-purple-100 text-purple-900' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    )}
  </div>

  {/* Frequency Filter Dropdown */}
  <div className="relative">
    <button
      onClick={() => toggleDropdown('frequency')}
      className="flex items-center gap-2 px-3 py-2 border border-purple-200 rounded-md bg-white text-sm text-gray-700 hover:bg-gray-50"
    >
      <Filter className="h-4 w-4" />
      {freqFilter || 'Filter by Frequency'}
      <ChevronDown size={16} className={`transition-transform ${dropdownOpen.frequency ? 'rotate-180' : ''}`} />
    </button>
    {dropdownOpen.frequency && (
      <div className="absolute z-50 mt-1 w-56 rounded-md bg-white shadow-lg border border-gray-200 max-h-60 overflow-auto">
        <div className="py-1">
          <button
            onClick={clearFrequencyFilter}
            className={`block w-full text-left px-4 py-2 text-sm ${!freqFilter ? 'bg-purple-100 text-purple-900' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            All Frequencies
          </button>
          {currentFrequencies.map(freq => (
            <button
              key={freq}
              onClick={() => handleFrequencyFilterSelect(freq)}
              className={`block w-full text-left px-4 py-2 text-sm ${freqFilter === freq ? 'bg-purple-100 text-purple-900' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              {freq}
            </button>
          ))}
        </div>
      </div>
    )}
  </div>
</div>
          </div>
        </div>
      </div>

      {currentUser && (
        <>
         {activeTab === 'checklist' ? (
  <div className="mt-4 rounded-lg border border-purple-200 shadow-md bg-white overflow-hidden">
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100 p-4">
      <h2 className="text-purple-700 font-medium">
        {userRole === 'admin' ? 'All Unique Tasks' : 'My Unique Tasks'}
      </h2>
      <p className="text-purple-600 text-sm">
        {userRole === 'admin' ? 'Showing all unique tasks from checklist' : CONFIG.PAGE_CONFIG.description}
      </p>
    </div>

    {/* Submit Button */}
    {selectedRows.size > 0 && (
      <div className="mb-4 flex justify-end p-4 bg-blue-50 border-b">
        <button
          onClick={submitSelectedTasks}
          disabled={submitting}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2"
        >
          {submitting ? (
            <>
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              Submitting...
            </>
          ) : (
            `Submit ${selectedRows.size} Selected Task${selectedRows.size === 1 ? '' : 's'}`
          )}
        </button>
      </div>
    )}

    <div className="hidden sm:block overflow-x-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0 z-20">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedRows.size === filteredChecklistTasks.length && filteredChecklistTasks.length > 0}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="ml-2">Action</span>
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-green-50">
      Task ID
    </th>
            {[
              { key: 'Department', label: 'Department' },
              { key: 'Given By', label: 'Given By' },
              { key: 'Name', label: 'Name' },
              { key: 'Task Description', label: 'Task Description', minWidth: 'min-w-[300px]' },
              { key: 'End Date', label: 'End Date', bg: 'bg-yellow-50' },
              { key: 'Frequency', label: 'Frequency' },
              { key: 'Reminders', label: 'Reminders' },
              { key: 'Attachment', label: 'Attachment' },
            ].map((column) => (
              <th
                key={column.label}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.bg || ''} ${column.minWidth || ''} ${column.key ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                onClick={() => column.key && requestSort(column.key)}
              >
                <div className="flex items-center">
                  {column.label}
                  {sortConfig.key === column.key && (
                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={9} className="px-6 py-8 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-2"></div>
                  <p className="text-purple-600">Loading Unique task...</p>
                </div>
              </td>
            </tr>
          ) : filteredChecklistTasks.length > 0 ? (
            filteredChecklistTasks.map((task) => {
              const isEditing = editingRows.has(task._id);
              const editedTask = editedData[task._id] || task;
              const isSelected = selectedRows.has(task._id);
              
              return (
                <tr key={task._id} className={`hover:bg-gray-50 ${isEditing ? 'bg-blue-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleRowSelection(task._id)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                  </td>
                     {/* NEW Task ID column */}
         {/* Task ID column - display from sheet */}
<td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 bg-green-50">
  {task['Task ID'] || 'N/A'}
</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedTask.Department || ''}
                        onChange={(e) => handleInputChange(task._id, 'Department', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    ) : (
                      task.Department || "—"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedTask['Given By'] || ''}
                        onChange={(e) => handleInputChange(task._id, 'Given By', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    ) : (
                      task['Given By'] || "—"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedTask.Name || ''}
                        onChange={(e) => handleInputChange(task._id, 'Name', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    ) : (
                      task.Name || "—"
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 min-w-[300px] max-w-[400px]">
                    {isEditing ? (
                      <textarea
                        value={editedTask['Task Description'] || ''}
                        onChange={(e) => handleInputChange(task._id, 'Task Description', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        rows={2}
                      />
                    ) : (
                      <div className="whitespace-normal break-words">
                        {task['Task Description'] || "—"}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 bg-yellow-50">
  {isEditing ? (
    <div className="flex gap-2 items-center">
      <input
        type="date"
        value={editedTask['End Date'] ? editedTask['End Date'].split(' ')[0].split('/').reverse().join('-') : ''}
        onChange={(e) => {
          if (e.target.value) {
            const [year, month, day] = e.target.value.split('-');
            handleInputChange(task._id, 'End Date', `${day}/${month}/${year} 00:00:00`);
          } else {
            handleInputChange(task._id, 'End Date', '');
          }
        }}
        className="px-2 py-1 border border-gray-300 rounded text-sm"
      />
      <input
        type="time"
        value={editedTask['End Date'] ? editedTask['End Date'].split(' ')[1] || '00:00' : '00:00'}
        onChange={(e) => {
          const dateStr = editedTask['End Date']?.split(' ')[0] || '';
          if (dateStr) {
            const [hours, minutes] = e.target.value.split(':');
            handleInputChange(task._id, 'End Date', `${dateStr} ${hours}:${minutes}:00`);
          }
        }}
        className="px-2 py-1 border border-gray-300 rounded text-sm"
      />
    </div>
  ) : (
    formatDate(task['End Date']) || "—"
  )}
</td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {isEditing ? (
                      <select
                        value={editedTask.Frequency || ''}
                        onChange={(e) => handleInputChange(task._id, 'Frequency', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="">Select Frequency</option>
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        task.Frequency === 'Daily' ? 'bg-blue-100 text-blue-800' :
                        task.Frequency === 'Weekly' ? 'bg-green-100 text-green-800' :
                        task.Frequency === 'Monthly' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.Frequency || "—"}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedTask.Reminders || ''}
                        onChange={(e) => handleInputChange(task._id, 'Reminders', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    ) : (
                      task.Reminders || "—"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedTask.Attachment || ''}
                        onChange={(e) => handleInputChange(task._id, 'Attachment', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    ) : (
                      task.Attachment || "—"
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                {searchTerm || nameFilter || freqFilter
                  ? "No tasks matching your filters"
                  : userRole === 'admin' ? "No unique tasks available" : "No unique tasks assigned to you"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* Mobile card view - replace existing mobile section with this */}
    <div className="sm:hidden space-y-4 p-4" style={{ maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' }}>
      {loading ? (
        <div className="text-center py-8">
          <div className="flex flex-col items-center justify-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-2"></div>
            <p className="text-purple-600">Loading Unique task...</p>
          </div>
        </div>
      ) : filteredChecklistTasks.length > 0 ? (
        <>
          {/* Select All Option - Mobile */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedRows.size === filteredChecklistTasks.length && filteredChecklistTasks.length > 0}
                onChange={handleSelectAll}
                className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <span className="font-medium text-purple-700">
                Select All ({selectedRows.size}/{filteredChecklistTasks.length})
              </span>
            </label>
          </div>
          
          {filteredChecklistTasks.map((task) => {
            const isEditing = editingRows.has(task._id);
            const editedTask = editedData[task._id] || task;
            const isSelected = selectedRows.has(task._id);
            
            return (
              <div key={task._id} className={`bg-white border rounded-lg p-4 shadow-sm ${
                isSelected ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
              } ${isEditing ? 'ring-2 ring-blue-200' : ''}`}>
                {/* Checkbox at top of card */}
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleRowSelection(task._id)}
                      className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="font-medium text-gray-700">
                      {isSelected ? 'Selected' : 'Select Task'}
                    </span>
                  </label>
                  {isEditing && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                      Editing Mode
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-medium text-gray-700">Department:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedTask.Department || ''}
                        onChange={(e) => handleInputChange(task._id, 'Department', e.target.value)}
                        className="w-[35%] px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    ) : (
                      <div className="text-sm text-gray-900 break-words text-right w-[35%]">
                        {task.Department || "—"}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-medium text-gray-700">Given By:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedTask['Given By'] || ''}
                        onChange={(e) => handleInputChange(task._id, 'Given By', e.target.value)}
                        className="w-[35%] px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    ) : (
                      <div className="text-sm text-gray-900 break-words text-right w-[35%]">
                        {task['Given By'] || "—"}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-medium text-gray-700">Name:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedTask.Name || ''}
                        onChange={(e) => handleInputChange(task._id, 'Name', e.target.value)}
                        className="w-[35%] px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    ) : (
                      <div className="text-sm text-gray-900 break-words text-right w-[35%]">
                        {task.Name || "—"}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-start border-b pb-2">
                    <span className="font-medium text-gray-700">Task Description:</span>
                    {isEditing ? (
                      <textarea
                        value={editedTask['Task Description'] || ''}
                        onChange={(e) => handleInputChange(task._id, 'Task Description', e.target.value)}
                        className="w-[35%] px-2 py-1 border border-gray-300 rounded text-sm"
                        rows={2}
                      />
                    ) : (
                      <div className="text-sm text-gray-900 break-words text-right w-[35%]">
                        {task['Task Description'] || "—"}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
  <span className="font-medium text-gray-700">End Date:</span>
  {isEditing ? (
    <div className="flex gap-1 items-center w-[35%]">
      <input
        type="date"
        value={editedTask['End Date'] ? editedTask['End Date'].split(' ')[0].split('/').reverse().join('-') : ''}
        onChange={(e) => {
          if (e.target.value) {
            const [year, month, day] = e.target.value.split('-');
            handleInputChange(task._id, 'End Date', `${day}/${month}/${year} 00:00:00`);
          } else {
            handleInputChange(task._id, 'End Date', '');
          }
        }}
        className="px-2 py-1 border border-gray-300 rounded text-sm"
      />
      <input
        type="time"
        value={editedTask['End Date'] ? editedTask['End Date'].split(' ')[1] || '00:00' : '00:00'}
        onChange={(e) => {
          const dateStr = editedTask['End Date']?.split(' ')[0] || '';
          if (dateStr) {
            const [hours, minutes] = e.target.value.split(':');
            handleInputChange(task._id, 'End Date', `${dateStr} ${hours}:${minutes}:00`);
          }
        }}
        className="px-2 py-1 border border-gray-300 rounded text-sm"
      />
    </div>
  ) : (
    <div className="text-sm text-gray-900 break-words bg-yellow-50 px-2 py-1 rounded text-right w-[35%]">
      {formatDate(task['End Date']) || "—"}
    </div>
  )}
</div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-medium text-gray-700">Frequency:</span>
                    {isEditing ? (
                      <select
                        value={editedTask.Frequency || ''}
                        onChange={(e) => handleInputChange(task._id, 'Frequency', e.target.value)}
                        className="w-[35%] px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="">Select Frequency</option>
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        task.Frequency === 'Daily' ? 'bg-blue-100 text-blue-800' :
                        task.Frequency === 'Weekly' ? 'bg-green-100 text-green-800' :
                        task.Frequency === 'Monthly' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.Frequency || "—"}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-medium text-gray-700">Reminders:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedTask.Reminders || ''}
                        onChange={(e) => handleInputChange(task._id, 'Reminders', e.target.value)}
                        className="w-[35%] px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    ) : (
                      <div className="text-sm text-gray-900 break-words text-right w-[35%]">
                        {task.Reminders || "—"}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Attachment:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedTask.Attachment || ''}
                        onChange={(e) => handleInputChange(task._id, 'Attachment', e.target.value)}
                        className="w-[35%] px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    ) : (
                      <div className="text-sm text-gray-900 break-words text-right w-[35%]">
                        {task.Attachment || "—"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <div className="text-center text-gray-500 py-8">
          {searchTerm || nameFilter || freqFilter
            ? "No tasks matching your filters"
            : userRole === 'admin' ? "No unique tasks available" : "No unique tasks assigned to you"}
        </div>
      )}
    </div>
  </div>
) : (
            <DelegationPage
              searchTerm={searchTerm}
              nameFilter={nameFilter}
              freqFilter={freqFilter}
              setNameFilter={setNameFilter}
              setFreqFilter={setFreqFilter}
              currentUser={currentUser}
              userRole={userRole}
              CONFIG={CONFIG}
              delegationTasks={delegationTasks}
              delegationLoading={delegationLoading}
              loading={delegationLoading}
            />
          )}
        </>
      )}
    </AdminLayout>
  );
}