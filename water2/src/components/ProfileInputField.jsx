const ProfileInputField = ({ label, type = "text", value, onChange, required = true }) => (
    <div className="mb-4">
      <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full border rounded-lg px-3 py-2 text-gray-700 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required={required}
      />
    </div>
  );
  export default ProfileInputField;
  