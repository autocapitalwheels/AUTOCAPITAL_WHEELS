import VehicleForm from '@/components/admin/VehicleForm';

export default function NewVehiclePage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-gray-900">Add New Vehicle</h1>
        <p className="text-gray-500 text-sm mt-0.5">Fill in the details to add a vehicle to your inventory</p>
      </div>
      <VehicleForm />
    </div>
  );
}
