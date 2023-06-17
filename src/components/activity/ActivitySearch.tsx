function ActivitySearch({ onChange }: { onChange: (search: string) => void }) {
  return (
    <div className="mt-2 mb-5 pr-4 pl-4">
      <input
        type="text"
        placeholder="Search activities"
        className="p-1
      border-[1px] border-gray-300 rounded-md w-full"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
export default ActivitySearch;
