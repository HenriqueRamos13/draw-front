import React from "react";

const NotFoundPage: React.FC = () => {
  return (
    <div className=" flex items-center justify-center w-full min-h-[80vh]">
      <div className="px-40 py-20 bg-white rounded-md shadow-xl dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <h1 className="font-bold text-blue-600 text-9xl">404</h1>

          <h6 className="mb-2 text-2xl font-bold text-center text-gray-800 md:text-3xl dark:text-gray-200">
            <span className="text-red-500">Oops!</span> Pagina não encontrada
          </h6>

          <p className="mb-8 text-center text-gray-500 md:text-lg dark:text-gray-400">
            A pagina que você está buscando não existe ou foi removida.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
