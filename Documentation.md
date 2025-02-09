# Stocker Project

## Project Context
Stocker is a comprehensive inventory management system designed to streamline the tracking of furniture stock movements within a warehouse. The project consists of a **frontend**, built with React and Material Tailwind, and a **backend**, developed using Node.js and Express. The system ensures accurate record-keeping of stock levels, allowing users to track product movements, manage users, and set up stock alerts.

## Difficulties Encountered & Solutions

### 1. **Stock Movement Tracking Issues**
- **Problem:** Initially, stock movements were not correctly recorded due to missing quantity updates.
- **Solution:** Implemented a logging system that records each change with timestamps and user details to maintain an accurate history.

### 2. **Real-Time Updates**
- **Problem:** Users needed real-time notifications for stock changes.
- **Solution:** Integrated **Socket.IO** for real-time data updates, allowing immediate reflection of stock movements on the UI.

### 3. **Frontend UI & State Management**
- **Problem:** UI components were not dynamically updating when new stock movements were added.
- **Solution:** Used React **useState** and **useEffect** hooks to trigger re-fetching of data when updates occur.

## Future of the Project

1. **Enhanced Reporting & Analytics**
    - Adding AI assisted stock trends and insights to help warehouse managers make data-driven decisions.

2. **Mobile-Friendly UI**
    - Optimizing the UI for mobile devices to allow warehouse staff to update stock movements on the go.

3. **Multi-Language Support**
    - Expanding language options to accommodate international users.

4. **Integration with External Systems**
    - Connecting with third-party logistics APIs for automatic stock updates.

---

### Repositories:
- **Frontend:** [Stocker Frontend Repo](https://github.com/Paul-Lecomte/stocker-frontend)
- **Backend:** [Stocker Backend Repo](https://github.com/Paul-Lecomte/stocker-backend)