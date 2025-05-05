import React, { useState, useEffect } from "react";
import UserForm from "../components/forms/UserForm";
import { useUser } from "../context/UserContext";
import { useUserProfile } from '../context/UserProfileContext'
import { useFilters } from "../hooks/useFilters";
import Modal from "../components/Modal";
import LogoutButton from "../components/LogoutButton";
import { userService } from '../api/userService'
import { courierService } from "../api/courierService";
import { clientService } from "../api/clientService";
import { normalizeAddressData, normalizeUserData, normalizeVehicleData } from "../utils/dataNormalizers";
import UserDeliveriesSection from "../components/UserDeliveriesSection";
import UserFeedbacksSection from "../components/UserFeedbacksSection"
import UserScheduleSection from "../components/UserScheduldeSection";
import SidebarProfile from "../components/SidebarProfile";
import styles from "./UserProfilePage.module.css";
import { Outlet } from "react-router-dom";

const UserProfilePage = () => {
  const [page, setPage] = useState(1);
  const limit = 5;
  const [totalPages, setTotalPages] = useState(0);

  const { userInfo, setUserInfo, isCourier, setIsCourier } = useUserProfile(); // Використовуємо контекст
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editDraft, setEditDraft] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (!user || !user?.sub) {
      console.error('User ID is not available.');
      return;
    }

    userService.getById(user?.sub)
      .then((response) => {
        const userData = response.data;
        setUserInfo(userData);

        const isCourier = userData.role === 'courier';
        setIsCourier(isCourier);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, [user]);

  const handleUserUpdate = () => {
    const normalizedUser = normalizeUserData(editDraft)

    userService.update(user?.sub, normalizedUser)
      .then(response => {
        setUserInfo(response.data);
        setIsModalOpen(false);
      })
      .catch(error => {
        console.error('Error updating user:', error);
      });

    if (isCourier) {
      const courierId = userInfo?.Courier?.courier_id;
      if (!courierId) return;

      const normalizedVehicle = normalizeVehicleData(editDraft.Courier.vehicle);

      courierService.update(courierId, {
        vehicle: normalizedVehicle
      })
        .then(response => {

          setUserInfo(prev => ({
            ...prev,
            Courier: {
              ...prev.Courier,
              vehicle: response.data.vehicle,
            },
          }));
          setIsModalOpen(false);
        })
        .catch(error => {
          console.error('Error updating courier data:', error);
        });
    } else {
      const clientId = userInfo.Client?.client_id;
      if (!clientId) return;

      const normalizedAddress = normalizeAddressData(editDraft.Client.address)

      clientService.updateAddress(clientId, normalizedAddress)
        .then(response => {
          setUserInfo(prev => ({
            ...prev,
            Client: {
              ...prev.Client,
              address: response.data,
            },
          }));
          setIsModalOpen(false);
        })
        .catch(error => {
          console.error('Error updating client address:', error);
        });
    }
  };

  const handleEditClick = () => {
    setEditDraft(JSON.parse(JSON.stringify(userInfo)));
    setIsModalOpen(true);
  };

  const displayValue = (value) => value || 'Not provided';

  if (!userInfo) return <div>Loading...</div>;
  const isAdmin = userInfo.role === 'admin';

  return (
    <div>
      <h1 className={styles.heading}>User Profile</h1>
      <div className={styles.row}>
        <div className={styles.section}>
          <h2>Basic Info</h2>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>User Name:</span>
            <span className={styles.infoValue}>{userInfo.first_name} {userInfo.last_name}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Email:</span>
            <span className={styles.infoValue}>{userInfo.email}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Phone Number:</span>
            <span className={styles.infoValue}>{userInfo.phone_number}</span>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.flexRow}>
            <div className={styles.flexItem}>
              <h2>{isCourier ? "Vehicle Info" : "Address Info"}</h2>
              {!isAdmin && isCourier ? (
                <>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>License Plate:</span>
                    <span className={styles.infoValue}>{userInfo.Courier?.vehicle.license_plate}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Model:</span>
                    <span className={styles.infoValue}>{userInfo.Courier?.vehicle.model}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Transport Type:</span>
                    <span className={styles.infoValue}>{userInfo.Courier?.vehicle.transport_type}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Company Owned:</span>
                    <span className={styles.infoValue}>{userInfo.Courier?.vehicle.is_company_owner ? "Yes" : "No"}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Country:</span>
                    <span className={styles.infoValue}>{displayValue(userInfo.Client?.address?.country)}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>City:</span>
                    <span className={styles.infoValue}>{displayValue(userInfo.Client?.address?.city)}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Street:</span>
                    <span className={styles.infoValue}>{displayValue(userInfo.Client?.address?.street_name)}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Building:</span>
                    <span className={styles.infoValue}>{displayValue(userInfo.Client?.address?.building_number)}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Apartment:</span>
                    <span className={styles.infoValue}>{displayValue(userInfo.Client?.address?.apartment_number)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <button onClick={handleEditClick} className={styles.button}>Edit</button>
      </div>


      <div className={styles.flexRow}>
        <SidebarProfile isOpen={sidebarOpen} setIsOpen={setSidebarOpen} isCourier={isCourier} />
        <Outlet />
      </div>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} onOK={handleUserUpdate}>
        <UserForm selectedUser={editDraft} setSelectedUser={setEditDraft} />
      </Modal>
    </div>
  );
};

export default UserProfilePage;
